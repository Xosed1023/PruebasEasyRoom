import { getName } from "src/pages/propinas/home/helpers/name"
import { capitalize } from "src/shared/helpers/capitalize"
import { getExactDate } from "src/utils/date"
import { getCurrencyFormat } from "src/utils/string"
import { getLabelTime } from "./time"

const getPaymentKey = (keys: any[]) => {
    if (keys?.length > 0) {
        if (keys?.length > 1) {
            return "mixto"
        } else {
            return keys?.[0]?.tipo_pago || ""
        }
    } else {
        return ""
    }
}

export const formatRoomServiceMostradorRows = (list: any[], formatCustomDate: (fecha: any, mask: string) => string) => {
    const orderList =
        list.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()) || []
  
    return orderList.map((i) => {
        const orden = i?.orden
        const base = [
            { value: orden?.orden || "-" },
            { value: orden?.turno?.nombre || "-" },
            {
                value: orden?.fecha_registro
                    ? `${formatCustomDate(getExactDate(orden?.fecha_registro), "DD/MMM/")} 
           ${formatCustomDate(getExactDate(orden?.fecha_registro), "hh:mm a")}`
                    : "-",
            },

            {
                value: orden?.colaborador_entrega ? getName(orden?.colaborador_entrega) : "-",
            },
            {
                value: getCurrencyFormat(orden?.total_con_iva || 0),
            },
            { value: capitalize(getPaymentKey(orden?.pago?.detalles_pago)) || "N/A" },
            { value: i?.tiempo_en_preparacion },
            { value: i?.tiempo_por_entregar },
            { value: i?.tiempo_en_entrega },
            { value: i?.tiempo_total },
            {
                value: {
                    estado_orden: orden?.estado_orden,
                    estado_pago: orden?.estado_pago,
                },
            },
        ]
        return {
            value: base,
        }
    })
}

export const formatRestaurantRows = (list: any[], formatCustomDate: (fecha: any, mask: string) => string) => {
    const orderList =
        list.sort(
            (a, b) => new Date(b.comanda?.fecha_registro).getTime() - new Date(a.comanda?.fecha_registro).getTime()
        ) || []

    return orderList.map((i) => {
        const comanda = i?.comanda
        const orden = comanda?.orden

        const base = [
            { value: orden?.orden || "-" },
            { value: comanda?.folio || "-" },
            { value: "Mesa " + (orden?.mesa?.numero_mesa || "-") },
            {
                value: `${orden?.turno?.nombre || "-"}\n${getLabelTime(getExactDate(comanda?.fecha_registro)) || "-"}`,
            },
            { value: orden?.colaborador_entrega ? getName(orden?.colaborador_entrega) : "-" },
            { value: getCurrencyFormat(comanda?.total_comanda || 0) },
            { value: capitalize(getPaymentKey(orden?.pago?.detalles_pago)) || "N/A" },
            { value: i?.tiempo_en_preparacion },
            { value: i?.tiempo_por_entregar },
            { value: i?.tiempo_total },
            {
                value: {
                    estado_orden: orden?.estado_orden,
                    estado_pago: orden?.estado_pago,
                },
            },
        ]
        return {
            value: base,
        }
    })
}
