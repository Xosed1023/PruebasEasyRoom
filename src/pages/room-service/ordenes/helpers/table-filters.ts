import { EstadosOrdenHistorial, OrdenesQuery, TiposPagos } from "src/gql/schema"

type TiposPagoFilter =
    | "todos_tipos_pago"
    | "visa_o_mastercard"
    | "efectivo"
    | "cortesia"
    | "amex"
    | "deposito_o_transferencia"
    | "consumo_interno"
type TiposEstatusOrdenFilter = "todos_tipos_estados" | `${EstadosOrdenHistorial}`
type TiposEstatusPagoFilter = "todos_estados_pago" | "pagado" | "no_pagado" | "cancelado"
type TiposOrigenFilter = "todos_origenes" | string

export type Filters = TiposPagoFilter | TiposEstatusOrdenFilter | TiposEstatusPagoFilter | TiposOrigenFilter

const tiposPagos: TiposPagoFilter[] = [
    "efectivo",
    "todos_tipos_pago",
    "visa_o_mastercard",
    "cortesia",
    "amex",
    "deposito_o_transferencia",
    "consumo_interno",
]
const tiposEstatusOrdenFilter: TiposEstatusOrdenFilter[] = [
    "todos_tipos_estados",
    "cancelada",
    "devolucion",
    "en_entrega",
    "en_preparacion",
    "entregada",
    "por_entregar",
]

const tiposEstatusPagosFilter: TiposEstatusPagoFilter[] = ["todos_estados_pago", "pagado", "no_pagado", "cancelado"]

export const selectFilter = ({
    orden,
    filter,
    fromHeader,
}: {
    orden?: OrdenesQuery["ordenes"][0]
    filter: Filters
    fromHeader?: string
}) => {
    if (tiposPagos.find((f) => f === filter)) {
        return filterByTipoPago({ orden, tipoPago: filter as TiposPagoFilter })
    }
    if (tiposEstatusOrdenFilter.find((f) => f === filter)) {
        return filterByOrdenEstatus({ orden, filter: filter as TiposEstatusOrdenFilter })
    }
    if (tiposEstatusPagosFilter.find((f) => f === filter)) {
        return filterByPago({ orden, filter: filter as TiposEstatusPagoFilter })
    }
    if (fromHeader === "origen" && filter) {
        return filterByOrigen({ orden, filter: filter as TiposOrigenFilter })
    }
}

export const filterByTipoPago = ({
    orden,
    tipoPago,
}: {
    orden?: OrdenesQuery["ordenes"][0]
    tipoPago: TiposPagoFilter
}): boolean => {
    const detalles = orden?.pagos?.flatMap((p) => p.detalles_pago || []) || []

    switch (tipoPago) {
        case "todos_tipos_pago":
            return true

        case "efectivo":
            return detalles.some((p) => p?.tipo_pago === TiposPagos.Efectivo)

        case "visa_o_mastercard":
            return detalles.some((p) => p?.tipo_pago === TiposPagos.VisaOMastercard)

        case "amex":
            return detalles.some((p) => p?.tipo_pago === TiposPagos.Amex)

        case "deposito_o_transferencia":
            return detalles.some((p) => p?.tipo_pago === TiposPagos.DepositoOTransferencia)

        case "consumo_interno":
            return detalles.some((p) => p?.tipo_pago === TiposPagos.ConsumoInterno)

        case "cortesia":
            return detalles.some((p) => p?.tipo_pago === TiposPagos.Cortesia)

        default:
            return false
    }
}

export const filterByOrdenEstatus = ({
    orden,
    filter,
}: {
    orden?: OrdenesQuery["ordenes"][0]
    filter: TiposEstatusOrdenFilter
}): boolean => {
    if (filter === "todos_tipos_estados") {
        return true
    } else if (orden?.estado_orden === filter) {
        return true
    }
    return false
}

export const filterByPago = ({
    orden,
    filter,
}: {
    orden?: OrdenesQuery["ordenes"][0]
    filter: TiposEstatusPagoFilter
}): boolean => {
    const tienePagos = (orden?.pagos?.length ?? 0) > 0
    const esCancelada = orden?.estado_orden === EstadosOrdenHistorial.Cancelada

    if (filter === "todos_estados_pago") {
        return true
    }

    if (filter === "pagado" && tienePagos && !esCancelada) {
        return true
    }

    if (filter === "no_pagado" && !tienePagos && !esCancelada) {
        return true
    }

    if (filter === "cancelado" && esCancelada) {
        return true
    }

    return false
}

export const filterByOrigen = ({
    orden,
    filter,
}: {
    orden?: OrdenesQuery["ordenes"][0]
    filter: TiposOrigenFilter
}): boolean => {
    if (filter === "todos_origenes") {
        return true
    } else if (orden?.origen_orden === filter) {
        return true
    }
    return false
}
