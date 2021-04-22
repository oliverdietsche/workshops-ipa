import { Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import { useFirebase, useStatusPresenter } from '../../providers';
import { LoadingAnimation, WorkshopDetails } from '../../ui';

export default function WorkshopDetailsView() {
	// null means waiting for a response from the api, undefined means there doesn't exist a workshop with that id
	const [workshop, setWorkshop] = useState<IWorkshop | null | undefined>(null);

	const { t } = useTranslation('pWorkshopDetails');
	const { showInfo, startLoading } = useStatusPresenter();
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
		const endLoading = startLoading(t('participationLoadingMessage'));
		functions
			.httpsCallable('addWorkshopAttendee')(params)
			.then((res: { data: IFunctionsApi['addWorkshopAttendeeOutput'] }) => {
				endLoading();
				const { entryUpdated, eventUpdated } = res.data;
				if (entryUpdated && eventUpdated) return showInfo(t('participationSuccessMessage'));
				return showInfo(t('participationErrorMessage'));
			})
			.catch(() => {
				endLoading();
				showInfo(t('participationErrorMessage'));
			});
	};

	const redirectToWorkshopPlanningPage = async () => router.push('/workshop/new');

	const isUserAllowedToParticipate = () => {
		if (!session?.user.email) return false;
		if (workshop.speaker && workshop.speaker.email === session.user.email) return false;
		if (workshop.attendees.map((attendee) => attendee.email).includes(session.user.email)) return false;
		return true;
	};

	return (
		<WorkshopDetails
			workshop={workshop}
			addAttendeeToWorkshop={addAttendeeToWorkshop}
			redirectToWorkshopPlanningPage={redirectToWorkshopPlanningPage}
			hideParticipateButton={!isUserAllowedToParticipate()}
		/>
	);
}
