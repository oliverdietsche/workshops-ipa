import { css } from '@emotion/react';
import { Fab, Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useTheme } from '../../../theme';
import { WorkshopPreview } from '../../components';

export interface IOverviewPageProps {
	workshops: IWorkshop[];
	redirectToWorkshopPage: (id: string) => void;
	redirectToWorkshopPlanningPage: () => void;
}

export function OverviewPage({
	workshops,
	redirectToWorkshopPage,
	redirectToWorkshopPlanningPage,
}: IOverviewPageProps) {
	const theme = useTheme();
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h3" component="h1">
					Workshops
				</Typography>
			</Grid>
			<Grid item container direction="row" spacing={1}>
				{workshops.map((workshop, index) => (
					<Grid key={`workshop-${workshop.id ?? index}`} item>
						<WorkshopPreview workshop={workshop} onClick={redirectToWorkshopPage} />
					</Grid>
				))}
			</Grid>
			<Fab
				css={css`
					position: absolute;
					bottom: ${theme.spacing(2)}px;
					right: ${theme.spacing(2)}px;
				`}
				color="primary"
				onClick={redirectToWorkshopPlanningPage}
			>
				<AddIcon />
			</Fab>
		</Grid>
	);
}
