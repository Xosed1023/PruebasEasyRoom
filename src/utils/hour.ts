export const getHourFormat = (date: Date | string, format24 = false): string => {
    const current = new Date(date)
    const hour = current.getHours()

    const displayHour = !format24 ? (hour > 12 ? hour - 12 : hour) : hour

    return `${("0" + displayHour).slice(-2)}:${("0" + current.getMinutes()).slice(-2)}${
        !format24 ? (hour > 12 ? " PM" : " AM") : ""
    }`
}
