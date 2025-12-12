import { getLimitDate } from "./../../helpers/date"
import { getPercent } from "./percent"

export const getTodayRentas = (rentas: any[]) => {
    return rentas.filter((item) => {
        const { max, min, current } = getLimitDate(item?.fecha_registro)

        return current >= min && current <= max
    })
}

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

export const getSoldRoomsData = (rentas: any[], rooms: number) => {
    const mostradorObj = {
        pie: 0,
        coche: 0,
        number: 0,
    }
    const reservaObj = {
        pie: 0,
        coche: 0,
        number: 0,
    }

    rentas.forEach((renta) => {
        if (renta) {
            if (renta?.reserva_id) {
                reservaObj.coche += renta?.tipo_entrada === "Auto" ? 1 : 0
                reservaObj.pie += renta?.tipo_entrada === "A_Pie" ? 1 : 0
                reservaObj.number += 1
            } else {
                mostradorObj.coche += renta?.tipo_entrada === "Auto" ? 1 : 0
                mostradorObj.pie += renta?.tipo_entrada === "A_Pie" ? 1 : 0
                mostradorObj.number += 1
            }
        }
    })

    return {
        rooms: rentas.length,
        reserva: {
            ...reservaObj,
            percent: getPercent(reservaObj.number, rentas.length),
        },
        mostrador: {
            ...mostradorObj,
            percent: getPercent(mostradorObj.number, rentas.length),
        },
        acumulada: getPercent(rentas.length, rooms),
    }
}

export const getBestSellingRoom = (rentas: any[], rooms: any[]): string => {
    if (rentas.length > 0) {
        const keys: string[] = rentas.map(({ habitacion_id = "" }) => {
            return habitacion_id
        })
        const uniqueElements = new Set(keys)
        const filteredElements = keys.filter((item) => {
            if (uniqueElements.has(item)) {
                uniqueElements.delete(item)
            } else {
                return item
            }
        })

        const list = [...new Set(filteredElements)]

        if (list.length > 0) {
            const room = rooms.find(({ habitacion_id }) => habitacion_id === list[0])
            return `${room?.tipo_habitacion?.nombre} ${room?.numero}`
        } else {
            return "Ninguna"
        }
    } else {
        return "Ninguna"
    }
}
