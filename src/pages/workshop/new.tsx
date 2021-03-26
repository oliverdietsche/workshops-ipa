import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useAuth } from '../../hooks';
import { useFirebase } from '../../providers';
import { LoadingAnimation, ViewStatusPresenter, WorkshopPlanningPage } from '../../ui';

const VIEW_STATUS_MESSAGES = {
	waiting: 'Dein Workshop wird erstellt',
	success: 'Dein Workshop wurde erfolgreich erstellt.',
	error: 'Beim Erstellen deines Workshops ist ein Fehler unterlaufen.',
};

export default function WorkshopPlanningView() {
	const [status, setStatus] = useState<TViewStatus>('ACTIVE');
	const router = useRouter();
	const { approved, session } = useAuth(true);
	const { functions } = useFirebase();

	if (!approved) return <LoadingAnimation />;

	const createWorkshop = (details: IWorkshopDetails) => {
		if (!functions || !session || !session.user.email) return;
		setStatus('WAITING');
		const speaker: ISpeaker = {
			email: session.user.email,
			refreshToken: session.refreshToken,
		};
		functions
			.httpsCallable('createWorkshop')({ details, speaker })
			.then(async (res: { data: IFunctionsApi['createWorkshopOutput'] }) => router.push(`/workshop/${res.data}`))
			.catch(() => setStatus('ERROR'));
	};

	return (
		<Fragment>
			<WorkshopPlanningPage createWorkshop={createWorkshop} />
			<ViewStatusPresenter status={status} setStatus={setStatus} messages={VIEW_STATUS_MESSAGES} />
		</Fragment>
	);
}
