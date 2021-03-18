import { addMinutes, isAfter, isBefore } from 'date-fns';
import { initializeApp } from 'firebase-admin';
import { https } from 'firebase-functions';
import { calendar_v3, google } from 'googleapis';
import { clientId, clientSecret } from './private/oauth2.json';
import {
	converter,
	convertWorkshopToEvent,
	getWorkshopByFirestoreId,
	initDb,
	openCalendarApi,
	removeRefreshTokenFromWorkshop
} from './utils';

initializeApp();
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'https://workshops-ipa.vercel.app');
const db = initDb();

/**
 * This endpoint creates a workshop database entry with the provided data.
 * If a speaker is provided, an according google calendar event in his calendar gets created.
 * The returned string is the id of the database entry;
 */
export const createWorkshop = https.onCall(
	async ({
		details,
		speaker,
	}: IFunctionsApi['createWorkshopParams']): Promise<IFunctionsApi['createWorkshopOutput']> => {
		const eventId = await (async () => {
			// If there's not speaker provided, an event can't be created
			if (!speaker) return null;

			oauth2Client.setCredentials({ refresh_token: speaker.refreshToken });
			const params: calendar_v3.Params$Resource$Events$Insert = {
				calendarId: 'primary',
				conferenceDataVersion: 1,
				sendUpdates: 'all',
				requestBody: {
					...convertWorkshopToEvent({ details, speaker, attendees: [] }),
				},
			};
			const insertedEvent = await openCalendarApi(oauth2Client).events.insert(params);
			return insertedEvent.data.id;
		})();

		const workshop: IWorkshop = {
			details,
			attendees: [],
			...(speaker && eventId
				? {
						speaker: {
							...speaker,
							eventId,
						},
				  }
				: {}),
		};
		const workshopEntry = await db.workshops.add(workshop);
		return workshopEntry.id;
	}
);

/**
 * This method needs a workshopId and an attendee object.
 * It adds the attendee to the workshop database entry and if the workshop has a speaker,
 * the attendee gets also added to the calendar event.
 * Returns an object with statuses whether the update of the database and/or the event were successful and
 * an optional reason which describes why something didn't update.
 */
export const addWorkshopAttendee = https.onCall(
	async ({
		workshopId,
		attendee: newAttendee,
	}: IFunctionsApi['addWorkshopAttendeeParams']): Promise<IFunctionsApi['addWorkshopAttendeeOutput']> => {
		const oldWorkshop = await getWorkshopByFirestoreId(workshopId);
		if (!oldWorkshop)
			return {
				entryUpdated: false,
				eventUpdated: false,
				reason: `A workshop with the id: ${workshopId} doesn't exist.`,
			};

		const updatedWorkshop: IWorkshop = {
			...oldWorkshop,
			attendees: [
				...oldWorkshop.attendees,
				...(oldWorkshop.attendees.every((attendee) => attendee.email !== newAttendee.email)
					? [newAttendee]
					: []),
			],
		};
		await db.workshops.doc(workshopId).update(updatedWorkshop);

		if (!updatedWorkshop.speaker)
			return {
				entryUpdated: true,
				eventUpdated: false,
				reason: `The workshop with the id: ${workshopId} doesn't have a speaker. The event will be created when a speaker is defined.`,
			};
		oauth2Client.setCredentials({ refresh_token: updatedWorkshop.speaker.refreshToken });
		const params: calendar_v3.Params$Resource$Events$Update = {
			calendarId: 'primary',
			eventId: updatedWorkshop.speaker.eventId,
			conferenceDataVersion: 1,
			sendUpdates: 'all',
			requestBody: {
				...convertWorkshopToEvent(updatedWorkshop),
			},
		};
		const updatedEvent = await openCalendarApi(oauth2Client).events.update(params);
		if (updatedEvent.status < 200 && updatedEvent.status >= 300) {
			return {
				entryUpdated: true,
				eventUpdated: false,
				reason: updatedEvent.statusText,
			};
		}
		return {
			entryUpdated: true,
			eventUpdated: true,
		};
	}
);

/**
 * Returns the workshop with the id provided.
 * If the workshop doesn't exist, undefined is returned.
 */
export const getWorkshopById = https.onCall(
	async ({ workshopId }: IFunctionsApi['getWorkshopByIdParams']): Promise<IFunctionsApi['getWorkshopByIdOutput']> => {
		const workshop = await getWorkshopByFirestoreId(workshopId);
		if (!workshop) return undefined;
		return removeRefreshTokenFromWorkshop({ ...workshop, id: workshopId });
	}
);

/**
 * Returns a list of all the workshops saved in the database.
 * A start and end can be provided as parameters which restricts the returned workshops to a timeframe.
 */
export const listWorkshops = https.onCall(
	async ({
		start: filterStart,
		end: filterEnd,
	}: IFunctionsApi['listWorkshopsParams']): Promise<IFunctionsApi['listWorkshopsOutput']> => {
		const workshopEntries = await db.workshops.withConverter(converter<IWorkshop>()).get();
		const workshopList = workshopEntries.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
		return workshopList
			.filter(({ details }) => {
				if (filterStart && isBefore(new Date(filterStart), new Date(details.start))) return false;
				if (filterEnd && isAfter(addMinutes(new Date(details.start), details.duration), new Date(filterEnd)))
					return false;
				return true;
			})
			.map((workshop) => removeRefreshTokenFromWorkshop(workshop));
	}
);
