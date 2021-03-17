import { addMinutes, formatRFC3339 } from 'date-fns';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { calendar_v3, google } from 'googleapis';
import { clientId, clientSecret } from './private/oauth2.json';

admin.initializeApp();
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'https://localhost:3000');

const openCalendarApi = () =>
	google.calendar({
		version: 'v3',
		auth: oauth2Client,
	});

// { "details": { "title": "Workshop Title", "description": "This is a very good workshop, please participate, much fun, much learn, muchos gracias.", "start": "2021-03-17T11:01:15+01:00", "duration": 60 }, "speaker": { "email": "oliver.dietsche@namics.com", "refreshToken": "1//093UeSwBYR2zhCgYIARAAGAkSNwF-L9Ir9T5uiQrN-9l9lMLna5K0tZ87FGCLgSMeEIZ1Hgwg2aabKsWRZ2mi_qy-oqxdMZaODBQ" } }

export const createWorkshop = functions.https.onCall(
	async ({
		details,
		speaker,
	}: IFunctionsApi['createWorkshopParams']): Promise<IFunctionsApi['createWorkshopOutput']> => {
		// Future implementation of workshop without speaker
		if (!speaker) return '';

		if (!speaker.refreshToken) return '';

		const event: calendar_v3.Schema$Event = {
			summary: details.title,
			start: { dateTime: details.start },
			end: { dateTime: formatRFC3339(addMinutes(new Date(details.start), details.duration)) },
			attendees: [{ email: speaker.email }],
			conferenceData: {
				createRequest: {
					conferenceSolutionKey: {
						type: 'hangoutsMeet',
					},
					requestId: `some-random-string-${Math.random()}`,
				},
			},
		};

		oauth2Client.setCredentials({ refresh_token: speaker.refreshToken });
		const params: calendar_v3.Params$Resource$Events$Insert = {
			calendarId: 'primary',
			conferenceDataVersion: 1,
			sendUpdates: 'all',
			requestBody: {
				...event,
			},
		};
		const insertedEvent = await openCalendarApi().events.insert(params);
		console.log(insertedEvent)

		const workshop: IWorkshop = {
			details,
			speaker: {
				...speaker,
				eventId: '',
			},
			attendees: [],
		};
		const workshopId = await admin.firestore().collection('workshops').add(workshop);
		return `${workshopId}`;
	}
);
