import { EstadosOrdenHistorial, OrdenesQuery, DetallePago } from "src/gql/schema"
import { getEstadoOrden } from "../helpers/en-servicio"

export function useFilters() {
    const handleFilter = (params: any[], data: OrdenesQuery["ordenes"]): OrdenesQuery["ordenes"] => {
        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const format = data.map((item) => {
            const detallesPago = item.pagos?.flatMap((p) => p.detalles_pago) || []

            return {
                item,
                filter: {
                    estatus: getEstadoOrden(item.origen_orden || "", item.estado_orden || ""),
                    origen: item.origen_orden || "",
                    pago:
                        detallesPago
                            .filter((p): p is DetallePago => !!p && !!p.tipo_pago)
                            .map((p) => p.tipo_pago)
                            .join(" ") || "",

                    estatus_pago:
                        item.estado_orden === EstadosOrdenHistorial.Cancelada
                            ? "cancelado"
                            : detallesPago.length > 0
                            ? "pagado"
                            : "no_pagado",
                    turno: item.turno?.nombre?.toLowerCase() || "todos_turnos",
                },
            }
        })

        const keyAll = params.filter(({ filter = "" }) => `${filter}`.includes("todos"))

        const clearParams =
            keyAll.length === 0 ? params : params.filter(({ idx }) => keyAll.find((item) => item.idx !== idx))
        if (clearParams.length > 0) {
            const results: any[] = []
            const estatusKeys = getKeys(1)
            const origenKeys = getKeys(2)
            const turnoKeys = getKeys(3)
            const pagoKeys = getKeys(8)
            const estatusPagoKeys = getKeys(9)

            format.forEach(({ item, filter }) => {
                if (
                    findValue(estatusKeys, filter.estatus) &&
                    findValue(origenKeys, filter.origen) &&
                    findValue(turnoKeys, filter.turno) &&
                    findValue(pagoKeys, filter.pago) &&
                    findValue(estatusPagoKeys, filter.estatus_pago)
                ) {
                    results.push(item)
                }
            })

            return [...results]
        } else {
            return [...data]
        }
    }

    return {
        handleFilter,
    }
}
