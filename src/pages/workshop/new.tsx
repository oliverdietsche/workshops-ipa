import { useRouter } from 'next/router';
import { useAuth } from '../../hooks';
import { useFirebase } from '../../providers';
import { LoadingAnimation } from '../../ui';
import { WorkshopPlanningPage } from '../../ui/pages/WorkshopPlanning';

export default function WorkshopPlanningView() {
	const router = useRouter();
	const { approved, session } = useAuth(true);
	const { functions } = useFirebase();

	if (!approved) return <LoadingAnimation />;

	const createWorkshop = (details: IWorkshopDetails) => {
		if (!functions || !session || !session.user.email) return;
		const speaker: ISpeaker = {
			email: session.user.email,
			refreshToken: session.refreshToken,
		};
		functions
			.httpsCallable('createWorkshop')({ details, speaker })
			.then(async (res: { data: string }) => router.push(`/workshop/${res.data}`));
	};

	return <WorkshopPlanningPage createWorkshop={createWorkshop} />;
}
