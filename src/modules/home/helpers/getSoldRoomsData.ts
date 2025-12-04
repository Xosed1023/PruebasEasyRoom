import { getPercent } from "./getPercent"

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