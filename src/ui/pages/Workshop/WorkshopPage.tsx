import { Button, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { formatDateShort, formatHoursFromTo, getStartAndEndDate } from '../../../utils';

export interface IWorkshopPageProps {
	workshop: IWorkshop;
	addAttendeeToWorkshop: () => void;
}

export function WorkshopPage({ workshop, addAttendeeToWorkshop }: IWorkshopPageProps) {
	const { details, speaker } = workshop;
	const { startDate, endDate } = getStartAndEndDate(details);
	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Typography variant="h4" component="h1">
					{details.title}
				</Typography>
			</Grid>
			<Grid container item xs={12} sm={4}>
				<List style={{ flexGrow: 1 }}>
					<ListItem>
						<ListItemIcon>
							<EventIcon color="secondary" />
						</ListItemIcon>
						<ListItemText>{formatDateShort(startDate)}</ListItemText>
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
					<ListItem>
						<Button fullWidth variant="contained" color="primary" onClick={addAttendeeToWorkshop}>
							Teilnehmen
						</Button>
					</ListItem>
				</List>
			</Grid>
			<Grid container item xs={12} sm={8} spacing={1} direction="column" >
				<Grid item>
					<Typography variant="h6">Beschreibung</Typography>
				</Grid>
				<Grid item>
					<Typography>{details.description}</Typography>
				</Grid>
			</Grid>
		</Grid>
	);
}
