export const humanDate = (
	date: Date,
	{
		weekday = 'long',
		year = 'numeric',
		month = 'long',
		day = 'numeric',
	}: Intl.DateTimeFormatOptions
) =>
	date.toLocaleDateString(undefined, {
		weekday,
		year,
		month,
		day,
	})

export const longDate = (date: Date) => date.toLocaleDateString(undefined, { dateStyle: 'long' })
