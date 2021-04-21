import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { formatRFC3339 } from 'date-fns';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import Trans from 'next-translate/Trans';
import React, { useCallback, useState } from 'react';

export interface IWorkshopFormProps {
	formTitle: string;
	submitText: string;
	onSubmit: (details: IWorkshopDetails) => void;
	initialDetails?: IWorkshopDetails;
}

/**
 * This form is for editing workshop details and submitting them.
 * By clicking the buton at the bottom, the information of the fields get validated.
 * If they're invalid, according text to help gets displayed.
 * If they're valid, the provided function gets executed, which creates a workshop.
 */
export function WorkshopForm({ formTitle, submitText, onSubmit, initialDetails }: IWorkshopFormProps) {
	const [validation, setValidation] = useState(false);
	const [title, setTitle] = useState<IWorkshopDetails['title']>(initialDetails?.title ?? '');
	const [description, setDescription] = useState<IWorkshopDetails['description']>(initialDetails?.description ?? '');
	const [start, setStart] = useState<IWorkshopDetails['start']>(initialDetails?.start ?? formatRFC3339(new Date()));
	const [duration, setDuration] = useState<IWorkshopDetails['duration']>(initialDetails?.duration ?? 60);

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
		onSubmit({
			title,
			description,
			start,
			duration,
		});
	};

	return (
		<DynamicNamespaces namespaces={['cWorkshopForm']}>
			<Grid container xs={12} spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h3" component="h1">
						{formTitle}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						value={title}
						label={<Trans i18nKey="cWorkshopForm:titleFieldLabel" />}
						error={validation && !isTitleValid()}
						helperText={
							validation && !isTitleValid() ? <Trans i18nKey="cWorkshopForm:titleFieldError" /> : ''
						}
						color="secondary"
						onChange={onTitleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						multiline
						value={description}
						label={<Trans i18nKey="cWorkshopForm:descriptionFieldLabel" />}
						error={validation && !isDescriptionValid()}
						helperText={
							validation && !isDescriptionValid() ? (
								<Trans i18nKey="cWorkshopForm:descriptionFieldError" />
							) : (
								''
							)
						}
						color="secondary"
						onChange={onDescriptionChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<DateTimePicker
						fullWidth
						disablePast
						value={start}
						label={<Trans i18nKey="cWorkshopForm:dateFieldLabel" />}
						error={validation && !isStartValid()}
						helperText={
							validation && !isStartValid() ? <Trans i18nKey="cWorkshopForm:dateFieldError" /> : ''
						}
						color="secondary"
						ampm={false}
						onChange={onStartChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						type="number"
						label={<Trans i18nKey="cWorkshopForm:durationLabel" />}
						value={duration}
						error={validation && !isDurationValid()}
						helperText={
							validation && !isDurationValid() ? <Trans i18nKey="cWorkshopForm:durationFieldError" /> : ''
						}
						color="secondary"
						onChange={onDurationChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<Button fullWidth variant="contained" color="primary" onClick={onSubmission}>
						{submitText}
					</Button>
				</Grid>
			</Grid>
		</DynamicNamespaces>
	);
}
