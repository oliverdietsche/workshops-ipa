import { addMinutes, formatRFC3339 } from 'date-fns';
import { calendar_v3, google } from 'googleapis';

/**
 * Opens connection to the google calendar v3 api
 * @param oauth2Client Initialized OAuth2 client
 * @returns google calendar api interface
 */
export function openCalendarApi(oauth2Client: any) {
	return google.calendar({
		version: 'v3',
		auth: oauth2Client,
	});
}

/**
 * Convert workshop to google calendar event schema
 * @param param0 Workshop to be converted
 * @returns Workshop in event schema
 */
export function convertWorkshopToEvent({ details, speaker, attendees }: IWorkshop): calendar_v3.Schema$Event {
	if (!speaker) throw new Error('Workshop needs an assigned speaker in order to create an event');
	return {
		summary: details.title,
		start: { dateTime: details.start },
		end: { dateTime: formatRFC3339(addMinutes(new Date(details.start), details.duration)) },
		attendees: [...attendees, { email: speaker.email }],
		description: details.description,
		conferenceData: {
			createRequest: {
				conferenceSolutionKey: {
					type: 'hangoutsMeet',
				},
				requestId: `some-random-string-${Math.random()}`,
			},
		},
	};
}

/**
 * Create new google calendar event for workshop
 * @param oauth2Client Initialized OAuth2 client
 * @param workshop Workshop to be created
 * @returns Id of the created event
 */
export async function insertWorkshopEvent(oauth2Client: any, workshop: IWorkshop) {
	// If the workshop doesn't have a speaker, an event can't be created
	if (!workshop.speaker) return null;

	oauth2Client.setCredentials({ refresh_token: workshop.speaker.refreshToken });
	const params: calendar_v3.Params$Resource$Events$Insert = {
		calendarId: 'primary',
		conferenceDataVersion: 1,
		sendUpdates: 'all',
		requestBody: {
			...convertWorkshopToEvent(workshop),
		},
	};
	const response = await openCalendarApi(oauth2Client).events.insert(params);
	return response.data.id;
}

/**
 * Delete the google calendar event of a workshop
 * @param oauth2Client Initialized OAuth2 client
 * @param workshop Workshop with the event to be deleted
 * @returns Empty object if successful
 */
export async function deleteWorkshopEvent(oauth2Client: any, workshop: IWorkshop) {
	// An eventId is needed to identify the event to delete
	if (!workshop.speaker || !workshop.speaker.eventId)
		throw new Error("the provided workshop doesn't have a speaker or eventId");
	const { eventId } = workshop.speaker;

	oauth2Client.setCredentials({ refresh_token: workshop.speaker.refreshToken });
	const params: calendar_v3.Params$Resource$Events$Delete = {
		calendarId: 'primary',
		eventId,
	};
	try {
		await openCalendarApi(oauth2Client).events.delete(params);
		return {};
	} catch (e) {
		throw new Error(`error attempting to delete event with id: ${eventId}`);
	}
}

/**
 * Update the google calendar event of a workshop with its information
 * @param oauth2Client Initialized OAuth2 client
 * @param workshop Workshop with updated information and the event to be updated
 * @returns Empty object if successful
 */
export async function updateWorkshopEvent(oauth2Client: any, workshop: IWorkshop) {
	// An eventId is needed to identify the event to update
	if (!workshop.speaker || !workshop.speaker.eventId)
		throw new Error("the provided workshop doesn't have a speaker or eventId");
	const { eventId } = workshop.speaker;

	oauth2Client.setCredentials({ refresh_token: workshop.speaker.refreshToken });
	const params: calendar_v3.Params$Resource$Events$Update = {
		calendarId: 'primary',
		eventId,
		conferenceDataVersion: 1,
		sendUpdates: 'all',
		requestBody: {
			...convertWorkshopToEvent(workshop),
		},
	};
	try {
		await openCalendarApi(oauth2Client).events.update(params);
		return {};
	} catch (e) {
		throw new Error(`error attempting to update event with id: ${eventId}`);
	}
}
