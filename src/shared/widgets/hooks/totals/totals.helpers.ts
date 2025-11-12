import { client } from "src/graphql"
import { GET_VENTAS_EXTRAS, GET_VENTAS_ORDENES, GET_VENTAS_RENTAS, GET_VENTAS_RESERVAS } from "./totals.graphql"
import { getDateParams } from "../rentas/date"

export const getResponse = (array: any[]) => {
    const response = {
        matutino: 0,
        vespertino: 0,
        nocturno: 0,
    }

    if (array.length > 0) {
        array?.forEach(({ turno = "", subtotal = 0 }) => {
            if (turno === "Matutino") response.matutino += subtotal
            if (turno === "Vespertino") response.vespertino += subtotal
            if (turno === "Nocturno") response.nocturno += subtotal
        })
    }

    return response
}

export const getTotals = async (hotel_id: string) => {
    const { fecha_final, fecha_inicial } = getDateParams()

    const variables = {
        fecha_final,
        fecha_inicial,
        hotel_id,
    }

    const list = await Promise.all([
        client.query({ query: GET_VENTAS_RENTAS, variables }),
        client.query({ query: GET_VENTAS_EXTRAS, variables }),
        client.query({ query: GET_VENTAS_RESERVAS, variables }),
    ])

    let filter: any[] = []

    list.forEach(({ data }) => {
        if (data && Object.values(data)) {
            const array: any[] = Object.values(data)
            const clear: any[] = array.map((item) => Object.values(item)).flat(2)

            filter = [...filter, ...clear]
        }
    })

    return getResponse(filter)
}

export const getTotalOrdenes = async (hotel_id: string) => {
    const { fecha_final, fecha_inicial } = getDateParams()

    const variables = {
        fecha_final,
        fecha_inicial,
        hotel_id,
    }
    const { data } = await client.query({ query: GET_VENTAS_ORDENES, variables })

    return getResponse(data?.obtener_ventas_ordenes?.acumulado_ordenes || [])
}
