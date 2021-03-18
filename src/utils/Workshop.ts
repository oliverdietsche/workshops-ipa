import { addMinutes, format } from 'date-fns';

export function getStartAndEndDate(details: IWorkshopDetails) {
	const startDate = new Date(details.start);
	const endDate = addMinutes(startDate, details.duration);
	return { startDate, endDate };
}

export function formatDateShort(date: Date) {
	return format(date, 'd. MMM yyyy');
}

export function formatHoursFromTo(startDate: Date, endDate: Date) {
	return `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;
}
