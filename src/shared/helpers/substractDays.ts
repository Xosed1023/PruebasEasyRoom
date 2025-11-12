export function substractDays({date, days}: {date: Date, days: number}): Date {
    // Clone the date to avoid modifying the original object
    const newDate = new Date(date)

    // Add one day to the cloned date
    newDate.setDate(date.getDate() - days)

    return newDate
}
