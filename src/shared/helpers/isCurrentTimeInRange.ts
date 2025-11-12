export function isCurrentTimeInRange(startTime: string, endTime: string, now: Date): boolean {
    const start = new Date()
    const end = new Date()

    // Parse las horas, minutos y segundos de las cadenas de tiempo
    const [startHour, startMinute, startSecond] = startTime.split(":").map(Number)
    const [endHour, endMinute, endSecond] = endTime.split(":").map(Number)

    // Establece las horas, minutos y segundos en los objetos Date
    start.setHours(startHour, startMinute, startSecond, 0)
    end.setHours(endHour, endMinute, endSecond, 0)

    // Comprueba si la hora actual está dentro del rango
    return now >= start && now <= end
}
