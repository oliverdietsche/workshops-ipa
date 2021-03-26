import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import { useFirebase } from '../../providers';
import { LoadingAnimation, ViewStatusPresenter, WorkshopPage } from '../../ui';

const VIEW_STATUS_MESSAGES = {
	waiting: 'Du wirst dem Workshop hinzugefügt',
	success:
		'Deine Teilnahme wurde bestätigt. Du hast ein Mail erhalten und der Workshop ist deinem Kalender hinzugefügt worden.',
	error: 'Beim Versuch deine Teilnahme zu registrieren ist ein Fehler unterlaufen.',
};

export default function WorkshopDetailsView() {
	const [status, setStatus] = useState<TViewStatus>('ACTIVE');
	// null means waiting for a response from the api, undefined means there doesn't exist a workshop with that id
	const [workshop, setWorkshop] = useState<IWorkshop | null | undefined>(null);

	const router = useRouter();
	const { functions } = useFirebase();
	const { approved, session } = useAuth(true);

	const { id } = router.query;
	const workshopId = typeof id === 'string' ? id : null;

	useEffect(() => {
		if (!functions || workshop || !workshopId) return;
		functions
			.httpsCallable('getWorkshopById')({
				workshopId,
			})
			.then((res: { data: IFunctionsApi['getWorkshopByIdOutput'] }) =>
				setWorkshop(res.data ? res.data : undefined)
			);
	}, [functions, workshop, workshopId]);

	if (!approved || !functions || workshop === null) return <LoadingAnimation />;
	if (workshop === undefined) return <Typography>This workshop doesn't exist...</Typography>;

	const addAttendeeToWorkshop = async () => {
		if (!workshopId || !session || !session.user.email) return;
		const params: IFunctionsApi['addWorkshopAttendeeParams'] = {
			workshopId,
			attendee: {
				email: session.user.email,
			},
		};
		setStatus('WAITING');
		functions
			.httpsCallable('addWorkshopAttendee')(params)
			.then((res: { data: IFunctionsApi['addWorkshopAttendeeOutput'] }) => {
				const { entryUpdated, eventUpdated } = res.data;
				if (entryUpdated && eventUpdated) return setStatus('SUCCESS');
				return setStatus('ERROR');
			})
			.catch(() => setStatus('ERROR'));
	};

	const redirectToWorkshopPlanningPage = async () => router.push('/workshop/new');

	const isUserAllowedToParticipate = () => {
		if (!session?.user.email) return false;
		if (workshop.speaker && workshop.speaker.email === session.user.email) return false;
		if (workshop.attendees.map((attendee) => attendee.email).includes(session.user.email)) return false;
		return true;
	};

	return (
		<Fragment>
			<WorkshopPage
				workshop={workshop}
				addAttendeeToWorkshop={addAttendeeToWorkshop}
				redirectToWorkshopPlanningPage={redirectToWorkshopPlanningPage}
				hideParticipateButton={!isUserAllowedToParticipate()}
			/>
			<ViewStatusPresenter status={status} setStatus={setStatus} messages={VIEW_STATUS_MESSAGES} />
		</Fragment>
	);
}
