export type DateStyle = 'full' | 'long' | 'medium' | 'short';
export type TimeStyle = 'full' | 'long' | 'medium' | 'short';

export const formatDate = (
	date: Date | string,
	locale: string,
	style: DateStyle = 'medium'
): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, { dateStyle: style }).format(d);
};

export const formatTime = (
	date: Date | string,
	locale: string,
	style: TimeStyle = 'short'
): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, { timeStyle: style }).format(d);
};

export const formatDateTime = (
	date: Date | string,
	locale: string,
	dateStyle: DateStyle = 'medium',
	timeStyle: TimeStyle = 'short'
): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(d);
};
