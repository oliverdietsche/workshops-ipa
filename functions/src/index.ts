import { addMinutes, isAfter, isBefore } from 'date-fns';
import { initializeApp } from 'firebase-admin';
import { https } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { google } from 'googleapis';
import { clientId, clientSecret } from './private/oauth2.json';
import {
	addEventIdToWorkshop,
	converter,
	deleteWorkshopByFirestoreId,
	deleteWorkshopEvent,
	getWorkshopByFirestoreId,
	getWorkshops,
	initDb,
	insertWorkshopEvent,
	removeRefreshTokenFromWorkshop,
	updateWorkshopEvent
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
	async ({ workshop }: IFunctionsApi['createWorkshopParams']): Promise<IFunctionsApi['createWorkshopOutput']> => {
		const eventId = await insertWorkshopEvent(oauth2Client, workshop);

		const newWorkshop: IWorkshop = addEventIdToWorkshop(workshop, eventId);
		const workshopEntry = await db.workshops.withConverter(converter<IWorkshop>()).add(newWorkshop);
		return workshopEntry.id;
	}
);

/**
 * This endpoint overwrites an existing workshop.
 * If the speaker of the workshop changed, the calendar event gets updated accordingly.
 * Else any changes get applied to the current event.
 */
export const updateWorkshop = https.onCall(
	async ({
		workshopId,
		workshop,
	}: IFunctionsApi['updateWorkshopParams']): Promise<IFunctionsApi['updateWorkshopOutput']> => {
		const oldWorkshop = await getWorkshopByFirestoreId(workshopId);
		if (!oldWorkshop) throw new HttpsError('invalid-argument', `workshopId: ${workshopId} is invalid`);

		const speakerChanged = oldWorkshop.speaker?.email !== workshop.speaker?.email;
		const updatedWorkshop = await (async () => {
			if (!speakerChanged) {
				try {
					workshop.speaker = oldWorkshop.speaker;
					await updateWorkshopEvent(oauth2Client, workshop);
					return workshop;
				} catch (e) {
					throw new HttpsError('unknown', 'an error occured trying to update the existing event');
				}
			}
			try {
				await deleteWorkshopEvent(oauth2Client, oldWorkshop);
			} catch (e) {
				throw new HttpsError('unknown', 'an error occured trying to delete the old event');
			}
			try {
				const eventId = await insertWorkshopEvent(oauth2Client, workshop);
				return addEventIdToWorkshop(workshop, eventId);
			} catch (e) {
				throw new HttpsError('unknown', 'an error occured trying to creating a new event');
			}
		})();

		await db.workshops.withConverter(converter<IWorkshop>()).doc(workshopId).update(updatedWorkshop);
		return '';
	}
);

/**
 * This method takes an id of a workshop and deletes its database entry and calendar event.
 */
export const deleteWorkshop = https.onCall(
	async ({ workshopId }: IFunctionsApi['deleteWorkshopParams']): Promise<IFunctionsApi['deleteWorkshopOutput']> => {
		const workshop = await getWorkshopByFirestoreId(workshopId);
		if (!workshop) throw new HttpsError('invalid-argument', `workshopId: ${workshopId} is invalid`);
		try {
			await deleteWorkshopEvent(oauth2Client, workshop);
		} catch (e) {
			throw new HttpsError('unknown', 'an error occured trying to delete the workshop event');
		}
		try {
			await deleteWorkshopByFirestoreId(workshopId);
		} catch (e) {
			throw new HttpsError('unknown', 'an error occured trying to delete the workshop database entry');
		}
		return '';
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
		await db.workshops.withConverter(converter<IWorkshop>()).doc(workshopId).update(updatedWorkshop);

		if (!updatedWorkshop.speaker)
			return {
				entryUpdated: true,
				eventUpdated: false,
				reason: `The workshop with the id: ${workshopId} doesn't have a speaker. The event will be created when a speaker is defined.`,
			};
		try {
			await updateWorkshopEvent(oauth2Client, updatedWorkshop);
			return {
				entryUpdated: true,
				eventUpdated: true,
			};
		} catch (e) {
			return {
				entryUpdated: true,
				eventUpdated: false,
			};
		}
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
		const workshops = await getWorkshops();
		return workshops
			.filter(({ details }) => {
				if (filterStart && isBefore(new Date(filterStart), new Date(details.start))) return false;
				if (filterEnd && isAfter(addMinutes(new Date(details.start), details.duration), new Date(filterEnd)))
					return false;
				return true;
			})
			.map((workshop) => removeRefreshTokenFromWorkshop(workshop));
	}
);
