import { css } from '@emotion/react';
import { Button, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EventIcon from '@material-ui/icons/Event';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { formatDate, formatHoursFromTo, getStartAndEndDate } from '../../../utils';
import { FloatingActionButtons } from '../../components';

export interface IWorkshopDetailsProps {
	workshop: IWorkshop;
	addAttendeeToWorkshop: () => void;
	redirectToWorkshopPlanningPage: () => void;
	hideParticipateButton?: boolean;
}

/**
 * This page provides details of a specific workshop, as well as the functionality to participate.
 */
export function WorkshopDetails({
	workshop,
	addAttendeeToWorkshop,
	redirectToWorkshopPlanningPage,
	hideParticipateButton = false,
}: IWorkshopDetailsProps) {
	const { lang } = useTranslation();
	const { details, speaker } = workshop;
	const { startDate, endDate } = getStartAndEndDate(details);
	return (
		<DynamicNamespaces namespaces={['cWorkshopDetails']} fallback="Loading...">
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h4" component="h1">
						{details.title}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={4}>
					<List style={{ flexGrow: 1 }}>
						<ListItem>
							<ListItemIcon>
								<EventIcon color="secondary" />
							</ListItemIcon>
							<ListItemText>{formatDate(startDate, lang)}</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ScheduleIcon color="secondary" />
							</ListItemIcon>
							<ListItemText>{formatHoursFromTo(startDate, endDate)}</ListItemText>
						</ListItem>
						{speaker ? (
							<ListItem>
								<ListItemIcon>
									<RecordVoiceOverIcon color="secondary" />
								</ListItemIcon>
								<ListItemText>{speaker.email}</ListItemText>
							</ListItem>
						) : null}
						{!hideParticipateButton ? (
							<ListItem>
								<Button fullWidth variant="contained" color="primary" onClick={addAttendeeToWorkshop}>
									<Trans i18nKey="cWorkshopDetails:participationButton" />
								</Button>
							</ListItem>
						) : null}
					</List>
				</Grid>
				<Grid container item xs={12} sm={8} spacing={1} direction="column">
					<Grid item>
						<Typography variant="h5">
							<Trans i18nKey="cWorkshopDetails:descriptionTitle" />
						</Typography>
					</Grid>
					<Grid item>
						<Typography
							css={css`
								white-space: pre-line;
							`}
						>
							{details.description}
						</Typography>
					</Grid>
				</Grid>
				<FloatingActionButtons
					items={[{ color: 'primary', icon: <AddIcon />, onClick: redirectToWorkshopPlanningPage }]}
				/>
			</Grid>
		</DynamicNamespaces>
	);
}
