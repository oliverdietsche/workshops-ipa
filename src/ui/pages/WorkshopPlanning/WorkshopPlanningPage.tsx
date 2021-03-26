import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { formatRFC3339 } from 'date-fns';
import React, { useCallback, useState } from 'react';

export interface IWorkshopPlanningPageProps {
	createWorkshop: (details: IWorkshopDetails) => void;
}

/**
 * This page provides a form to plan a new workshop.
 * By clicking the buton at the bottom, the information of the fields get validated.
 * If they're invalid, according text to help gets displayed.
 * If they're valid, the provided function gets executed, which creates a workshop.
 */
export function WorkshopPlanningPage({ createWorkshop }: IWorkshopPlanningPageProps) {
	const [validation, setValidation] = useState(false);
	const [title, setTitle] = useState<IWorkshopDetails['title']>('');
	const [description, setDescription] = useState<IWorkshopDetails['description']>('');
	const [start, setStart] = useState<IWorkshopDetails['start']>(formatRFC3339(new Date()));
	const [duration, setDuration] = useState<IWorkshopDetails['duration']>(60);

	const onTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value), []);

	const onDescriptionChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value),
		[]
	);

	const onStartChange = useCallback((newStart: MaterialUiPickersDate) => {
		if (!newStart) return;
		setStart(formatRFC3339(newStart));
	}, []);

	const onDurationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === '') return setDuration(0);
		setDuration(parseInt(event.target.value, 10));
	}, []);

	const isTitleValid = useCallback(() => title !== '', [title]);
	const isDescriptionValid = useCallback(() => description !== '', [description]);
	const isStartValid = useCallback(() => start !== '', [start]);
	const isDurationValid = useCallback(() => duration > 0, [duration]);

	const onSubmission = () => {
		if (!isTitleValid() || !isDescriptionValid() || !isStartValid() || !isDurationValid())
			return setValidation(true);
		setValidation(false);
		createWorkshop({
			title,
			description,
			start,
			duration,
		});
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h3" component="h1">
					Neuer Workshop
				</Typography>
			</Grid>
			<Grid container item xs={12} spacing={3}>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label="Titel"
						error={validation && !isTitleValid()}
						helperText={validation && !isTitleValid() ? 'Der Workshop benötigt einen Titel.' : ''}
						color="secondary"
						onChange={onTitleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						multiline
						label="Beschreibung"
						error={validation && !isDescriptionValid()}
						helperText={
							validation && !isDescriptionValid() ? 'Der Workshop benötigt eine Beschreibung.' : ''
						}
						color="secondary"
						onChange={onDescriptionChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<DateTimePicker
						fullWidth
						minDate={new Date()}
						format="d. MMM yyyy HH:mm"
						value={start}
						label="Workshop Start"
						error={validation && !isStartValid()}
						helperText={validation && !isStartValid() ? 'Der Workshop benötigt einen Startzeitpunkt.' : ''}
						color="secondary"
						onChange={onStartChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						type="number"
						label="Dauer"
						value={duration}
						error={validation && !isDurationValid()}
						helperText={
							validation && !isDurationValid() ? 'Der Workshop muss länger als 0 Minuten dauern.' : ''
						}
						color="secondary"
						onChange={onDurationChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button fullWidth variant="contained" color="primary" onClick={onSubmission}>
						Planen
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
