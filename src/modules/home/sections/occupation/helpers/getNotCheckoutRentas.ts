import { getLimitDate } from "./getLimitDate"

export const getNotCheckOutRentas = (rooms: any[]) => {
    let number = 0
    rooms?.forEach((item) => {
        if (item?.ultima_renta) {
            const { max, min, current } = getLimitDate(item?.ultima_renta?.fecha_condensada)

            if (!(current >= min && current <= max)) number += 1
        }
    })
    return number
}