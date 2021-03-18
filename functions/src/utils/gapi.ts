import { addMinutes, formatRFC3339 } from 'date-fns';
import { calendar_v3, google } from 'googleapis';

/**
 * Opens the connection to the google calendar api v3.
 * Takes an OAuth2Client object.
 * Returns an object to access the calendar api.
 */
export function openCalendarApi(oauth2Client: any) {
	return google.calendar({
		version: 'v3',
		auth: oauth2Client,
	});
}

/**
 * Takes a workshop object and converts it into the required format of a calendar event.
 */
export function convertWorkshopToEvent({ details, speaker, attendees }: IWorkshop): calendar_v3.Schema$Event {
	if (!speaker) throw new Error('Workshop needs an assigned speaker in order to create an event');
	return {
		summary: details.title,
		start: { dateTime: details.start },
		end: { dateTime: formatRFC3339(addMinutes(new Date(details.start), details.duration)) },
		attendees: [...attendees, { email: speaker.email }],
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
