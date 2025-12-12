export function addCurrentTime(inputDate: Date): Date {
    // Get the current date and time
    const currentDate = new Date()

    // Get the hours, minutes, and seconds of the current date
    const currentHours = currentDate.getHours()
    const currentMinutes = currentDate.getMinutes()
    const currentSeconds = currentDate.getSeconds()

    // Clone the input date to avoid modifying the original
    const newDate = new Date(inputDate)

    // Add the current hours, minutes, and seconds to the input date
    newDate.setHours(newDate.getHours() + currentHours)
    newDate.setMinutes(newDate.getMinutes() + currentMinutes)
    newDate.setSeconds(newDate.getSeconds() + currentSeconds)

    return newDate
}
