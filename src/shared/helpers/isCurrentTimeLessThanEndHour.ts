export function isCurrentTimeLessThanEndHour(endTime: string, now: Date): boolean {
    const end = new Date()

    // Parse las horas, minutos y segundos de las cadenas de tiempo
    const [endHour, endMinute, endSecond] = endTime.split(":").map(Number)

    // Establece las horas, minutos y segundos en los objetos Date
    end.setHours(endHour, endMinute, endSecond, 0)
    
    // Comprueba si la hora actual está dentro del rango
    return now <= end
}
