import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks';
import { useFirebase, useStatusPresenter } from '../../providers';
import { LoadingAnimation, WorkshopForm } from '../../ui';

export default function WorkshopPlanningView() {
	const { t } = useTranslation('pWorkshopNew');
	const { showInfo, startLoading } = useStatusPresenter();
	const router = useRouter();
	const { approved, session } = useAuth(true);
	const { functions } = useFirebase();

	if (!approved) return <LoadingAnimation />;

	const createWorkshop = (details: IWorkshopDetails) => {
		if (!functions || !session || !session.user.email) return;
		const endLoading = startLoading('Dein Workshop wird erstellt');
		const workshop: IWorkshop = {
			details,
			speaker: {
				email: session.user.email,
				refreshToken: session.refreshToken,
			},
			attendees: [],
		};
		functions
			.httpsCallable('createWorkshop')({ workshop })
			.then(async (res: { data: IFunctionsApi['createWorkshopOutput'] }) => {
				endLoading();
				router.push(`/workshop/${res.data}`);
				showInfo('Dein Workshop wurde erfolgreich erstellt.');
			})
			.catch(() => {
				endLoading();
				showInfo('Beim Erstellen deines Workshops ist ein Fehler unterlaufen.');
			});
	};

	return <WorkshopForm formTitle={t('formTitle')} submitText={t('submitText')} onSubmit={createWorkshop} />;
}
