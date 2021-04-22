import { addMinutes } from 'date-fns';

export function getStartAndEndDate(details: IWorkshopDetails) {
	const startDate = new Date(details.start);
	const endDate = addMinutes(startDate, details.duration);
	return { startDate, endDate };
}
