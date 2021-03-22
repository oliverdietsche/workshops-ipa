import { css } from '@emotion/react';
import { Grid, Typography } from '@material-ui/core';
import { isAfter, isBefore } from 'date-fns';
import { Fragment } from 'react';
import { useTheme } from '../../../theme';
import { NewWorkshopButton, WorkshopPreview } from '../../components';

export interface IOverviewPageProps {
	workshops: IWorkshop[];
	redirectToWorkshopPage: (id: string) => void;
	redirectToWorkshopPlanningPage: () => void;
}

/**
 * This page provides an overview of all workshops.
 */
export function OverviewPage({
	workshops,
	redirectToWorkshopPage,
	redirectToWorkshopPlanningPage,
}: IOverviewPageProps) {
	const theme = useTheme();

	const upcomingWorkshops = workshops.filter((workshop) => isAfter(new Date(workshop.details.start), new Date()));
	const pastWorkshops = workshops.filter((workshop) => isBefore(new Date(workshop.details.start), new Date()));

	return (
		<Grid container spacing={4}>
			<Grid item xs={12}>
				<Typography variant="h3" component="h1">
					Willkommen zu den Workshops!
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Hier können lernfreudige Namics Mitarbeiter und Mitarbeiterinnen freiwillig an Workshops teilnehmen,
					die von Gleichgesinnten angeboten werden. Unterhalb werden die Workshops aufgelistet, auf die
					geklickt werden kann, um Details zu sehen und sich dafür anzumelden.
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Falls du gerne selbst einen Workshop anbieten möchtest, kannst du diesen ganz einfach über den Knopf
					unten rechts planen. Für den Workshop wird ein Kalendereintrag eine eigene URL erstellt. Die URL
					soll mit Arbeitskollegen und Kolleginnen geteilt werden, damit diese sich für den Workshop anmelden
					können – sie werden sich bestimmt freuen.
				</Typography>
			</Grid>
			{upcomingWorkshops.length > 0 ? (
				<Fragment>
					<Grid item xs={12}>
						<Typography variant="h4" component="h2">
							Aktuelle Workshops
						</Typography>
					</Grid>
					<Grid item container direction="row" spacing={3}>
						{upcomingWorkshops.map((workshop, index) => (
							<Grid
								key={`workshop-${workshop.id ?? index}`}
								item
								css={css`
									${theme.breakpoints.down('xs')} {
										width: 100%;
									}
								`}
							>
								<WorkshopPreview workshop={workshop} onClick={redirectToWorkshopPage} />
							</Grid>
						))}
					</Grid>
				</Fragment>
			) : null}
			{pastWorkshops.length > 0 ? (
				<Fragment>
					<Grid item xs={12}>
						<Typography variant="h4" component="h2">
							Vergangene Workshops
						</Typography>
					</Grid>
					<Grid item container direction="row" spacing={3}>
						{pastWorkshops.map((workshop, index) => (
							<Grid
								key={`workshop-${workshop.id ?? index}`}
								item
								css={css`
									${theme.breakpoints.down('xs')} {
										width: 100%;
									}
								`}
							>
								<WorkshopPreview inactive workshop={workshop} onClick={redirectToWorkshopPage} />
							</Grid>
						))}
					</Grid>
				</Fragment>
			) : null}
			{upcomingWorkshops.length === 0 && pastWorkshops.length === 0 ? (
				<Grid item xs={12}>
					<Typography variant="body2">Keine Workshops geplant...</Typography>
				</Grid>
			) : null}
			<NewWorkshopButton redirectToWorkshopPlanningPage={redirectToWorkshopPlanningPage} />
		</Grid>
	);
}
