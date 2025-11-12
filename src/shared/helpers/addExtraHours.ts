export const addExtraHours = (endDate: Date, hours = 0): Date => {
    const endDateCopy = new Date(endDate.getTime?.())
    const timeExtra = new Date(endDateCopy.setUTCHours(endDateCopy.getUTCHours() + hours))

    return timeExtra
}
