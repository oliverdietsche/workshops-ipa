import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import { useFirebase } from '../../providers';
import { LoadingAnimation, WorkshopPage } from '../../ui';

export default function WorkshopDetailsView() {
	const [workshop, setWorkshop] = useState<IWorkshop>();

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
			.then((res: { data: IWorkshop }) => setWorkshop(res.data));
	}, [functions, workshop, workshopId]);

	if (!approved || !functions || !workshop) return <LoadingAnimation />;

	const addAttendeeToWorkshop = async () => {
		if (!workshopId || !session || !session.user.email) return;
		const params: IFunctionsApi['addWorkshopAttendeeParams'] = {
			workshopId,
			attendee: {
				email: session.user.email,
			},
		};
		const res = await functions.httpsCallable('addWorkshopAttendee')(params);
		console.log(res.data);
	};

	return <WorkshopPage workshop={workshop} addAttendeeToWorkshop={addAttendeeToWorkshop} />;
}
