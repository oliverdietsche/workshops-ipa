import { Typography } from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks';
import { useFirebase, useStatusPresenter } from '../../../providers';
import { LoadingAnimation, WorkshopForm } from '../../../ui';

export default function WorkshopDetailsView() {
	// null means waiting for a response from the api, undefined means there doesn't exist a workshop with that id
	const [workshop, setWorkshop] = useState<IWorkshop | null | undefined>(null);

	const { t } = useTranslation('pWorkshopEdit');
	const { showInfo, startLoading } = useStatusPresenter();
	const router = useRouter();
	const { functions } = useFirebase();
	const { approved } = useAuth(true);

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

	const updateWorkshop = async (details: IWorkshopDetails) => {
		if (!workshopId || !workshop) return;
		const params: IFunctionsApi['updateWorkshopParams'] = {
			workshopId,
			workshop: {
				...workshop,
				details,
			},
		};
		const endLoading = startLoading('Die Änderungen werden übernommen');
		await functions
			.httpsCallable('updateWorkshop')(params)
			.then(async () => {
				endLoading();
				router.push(`/workshop/${workshopId}`);
				showInfo('Die Änderungen wurden erfolgreich übernommen.');
			})
			.catch(() => {
				endLoading();
				showInfo('Beim Versuch die Änderungen zu übernehmen ist ein Fehler unterlaufen.');
			});
	};

	return (
		<WorkshopForm
			formTitle={t('formTitle')}
			submitText={t('submitText')}
			initialDetails={workshop.details}
			onSubmit={updateWorkshop}
		/>
	);
}
