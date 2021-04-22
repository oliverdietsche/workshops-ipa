import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

const LOCALES = { de, en: enUS };

export function formatDate(date: Date, locale: string) {
	return format(date, 'EEE, do MMMM, yyyy', { locale: LOCALES[locale] });
}

export function formatDateShort(date: Date, locale: string) {
	return format(date, 'do MMMM, yyyy', { locale: LOCALES[locale] });
}

export function formatHoursFromTo(startDate: Date, endDate: Date) {
	return `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;
}
