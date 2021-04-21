import { css } from '@emotion/react';
import { Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { isAfter, isBefore } from 'date-fns';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '../hooks';
import { useFirebase } from '../providers';
import { FloatingActionButtons, LoadingAnimation, WorkshopPreviewList } from '../ui';

export default function WorkshopOverview() {
	const { t } = useTranslation('pOverview');
	const router = useRouter();
	const { approved } = useAuth(true);
	const { functions } = useFirebase();

	const [workshops, setWorkshops] = useState<IWorkshop[]>();

	useEffect(() => {
		if (!functions || workshops) return;
		functions
			.httpsCallable('listWorkshops')({})
			.then((res: { data: IFunctionsApi['listWorkshopsOutput'] }) => setWorkshops(res.data));
	}, [functions, workshops]);

	if (!approved || !functions || !workshops) return <LoadingAnimation />;

	const redirectToWorkshopPage = async (id: string) => router.push(`/workshop/${id}`);
	const redirectToWorkshopPlanningPage = async () => router.push('/workshop/new');

	const upcomingWorkshops = workshops.filter((workshop) => isAfter(new Date(workshop.details.start), new Date()));
	const pastWorkshops = workshops.filter((workshop) => isBefore(new Date(workshop.details.start), new Date()));

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant="h3" component="h1">
					{t('title')}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography
					css={css`
						white-space: pre-line;
					`}
				>
					{t('hint')}
				</Typography>
			</Grid>
			{upcomingWorkshops.length > 0 ? (
				<Fragment>
					<Grid item xs={12}>
						<Typography variant="h4" component="h2">
							{t('futureWorkshopsTitle')}
						</Typography>
					</Grid>
					<WorkshopPreviewList item workshops={upcomingWorkshops} onClick={redirectToWorkshopPage} />
				</Fragment>
			) : null}
			{pastWorkshops.length > 0 ? (
				<Fragment>
					<Grid item xs={12}>
						<Typography variant="h4" component="h2">
							{t('pastWorkshopsTitle')}
						</Typography>
					</Grid>
					<WorkshopPreviewList item inactive workshops={pastWorkshops} onClick={redirectToWorkshopPage} />
				</Fragment>
			) : null}
			{upcomingWorkshops.length === 0 && pastWorkshops.length === 0 ? (
				<Grid item xs={12}>
					<Typography variant="body2">{t('noWorkshopsInfo')}</Typography>
				</Grid>
			) : null}
			<FloatingActionButtons
				items={[{ color: 'primary', icon: <AddIcon />, onClick: redirectToWorkshopPlanningPage }]}
			/>
		</Grid>
	);
}
