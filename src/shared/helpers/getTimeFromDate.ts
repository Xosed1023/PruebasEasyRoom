
/**
 * recive un objeto Date() -> devuelve Date sumando las horas de la fecha actual
 */
export const getTimeFromDate = (startDate: Date, now: Date) => {
    // Get the hours, minutes, and seconds of the current date
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
  
    // Clone the input date to avoid modifying the original
    const newDate = new Date(startDate);
  
    // Add the current hours, minutes, and seconds to the input date
    newDate.setHours(newDate.getHours() + currentHours);
    newDate.setMinutes(newDate.getMinutes() + currentMinutes);
    newDate.setSeconds(newDate.getSeconds() + currentSeconds);
  
    return newDate;
}