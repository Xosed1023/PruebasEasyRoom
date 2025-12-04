import { getLimitDate } from "./getLimitDate"

export const getTodayBookings = (rooms: any[]) => {
    let number = 0
    rooms.forEach((item) => {
        if (item?.estado === "reservada" && item?.ultima_reserva) {
            const { max, min, current } = getLimitDate(item?.ultima_reserva?.reserva?.fecha_entrada)

            if (current >= min && current <= max) number += 1
        }
    })
    return number
}