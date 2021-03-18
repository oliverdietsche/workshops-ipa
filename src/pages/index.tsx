import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useFirebase } from '../providers';
import { LoadingAnimation, OverviewPage } from '../ui';

export default function WorkshopOverview() {
	const [workshops, setWorkshops] = useState<IWorkshop[]>();
	const router = useRouter();
	const { approved } = useAuth(true);
	const { functions } = useFirebase();

	useEffect(() => {
		if (!functions || workshops) return;
		functions
			.httpsCallable('listWorkshops')({})
			.then((res: { data: IWorkshop[] }) => setWorkshops(res.data));
	}, [functions, workshops]);

	if (!approved || !functions || !workshops) return <LoadingAnimation />;

	const redirectToWorkshopPage = async (id: string) => router.push(`/workshop/${id}`);
	const redirectToWorkshopPlanningPage = async () => router.push('/workshop/new');
	return (
		<OverviewPage
			workshops={workshops}
			redirectToWorkshopPage={redirectToWorkshopPage}
			redirectToWorkshopPlanningPage={redirectToWorkshopPlanningPage}
		/>
	);
}
