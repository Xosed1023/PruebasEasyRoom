import { OrigenOrden } from "src/gql/schema"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"

export const payments = [
    {
        label: "Efectivo",
        value: "efectivo",
    },
    {
        label: "Cortesía",
        value: "cortesia",
    },
]

export const estadosOrdenes = {
    entregada: "Entregada",
    en_entrega: "En entrega",
    por_entregar: "Por entregar",
    en_preparacion: "En preparación",
    devolucion: "Devolución",
    cancelada: "Cancelada",
    en_servicio: "En servicio",
}

export const allOrdersHeaders: FlexibleTableHeaderColumn[] = [
    {
        value: "Orden",
    },
    {
        value: "Estatus de orden",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_tipos_estados", valueToDisplay: "Todos" },
            ...Object.keys(estadosOrdenes).map((value) => {
                return {
                    value,
                    valueToDisplay: estadosOrdenes?.[value] || "",
                }
            }),
        ],
    },
    {
        value: "origen",
        valueToDisplay: "Origen",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_origenes", valueToDisplay: "Todos" },
            { value: OrigenOrden.RoomService, valueToDisplay: "Room Service"  },
            { value: "mostrador", valueToDisplay: "Mostrador" }
        ]
    },
    {
        value: "Turno",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_turnos", valueToDisplay: "Todos" },
            { value: "matutino", valueToDisplay: "Matutino" },
            { value: "vespertino", valueToDisplay: "Vespertino" },
            { value: "nocturno", valueToDisplay: "Nocturno" },
        ],
    },
    {
        value: "Fecha y hora de venta",
    },
    {
        value: "Responsable",
    },
    {
        value: "Productos",
    },
    {
        value: "Total",
    },
    {
        value: "Método de pago",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_tipos_pago", valueToDisplay: "Todos" },
            { value: "visa_o_mastercard", valueToDisplay: "Visa o mastercard" },
            { value: "efectivo", valueToDisplay: "Efectivo" },
            { value: "amex", valueToDisplay: "AMEX" },
            { value: "consumo_interno", valueToDisplay: "Consumo interno" },
            { value: "cortesia", valueToDisplay: "Cortesía" },
        ],
    },
    {
        value: "Estatus de pago",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_estados_pago", valueToDisplay: "Todos" },
            { value: "pagada", valueToDisplay: "Pagada" },
            { value: "no_pagada", valueToDisplay: "Pendiente" },
            //{ value: "cancelado", valueToDisplay: "Cancelada" },
        ],
    },
    {
        value: "Ticket",
    },
]

export const headersPendientes: FlexibleTableHeaderColumn[] = [
    {
        value: "Orden",
    },
    {
        value: "Turno",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_turnos", valueToDisplay: "Todos" },
            { value: "matutino", valueToDisplay: "Matutino" },
            { value: "vespertino", valueToDisplay: "Vespertino" },
            { value: "nocturno", valueToDisplay: "Nocturno" },
        ],
    },
    {
        value: "Fecha y hora de venta",
    },
    {
        value: "Habitación",
    },
    {
        value: "Productos vendidos",
    },
    {
        value: "Total",
    },
    {
        value: "Ticket",
    },
]

export const headersPagadas: FlexibleTableHeaderColumn[] = [
    {
        value: "Orden",
    },
    {
        value: "Fecha y hora de venta",
    },
    {
        value: "Turno",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_turnos", valueToDisplay: "Todos" },
            { value: "matutino", valueToDisplay: "Matutino" },
            { value: "vespertino", valueToDisplay: "Vespertino" },
            { value: "nocturno", valueToDisplay: "Nocturno" },
        ],
    },
    {
        value: "Tipo de venta",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_tipos_venta", valueToDisplay: "Todas" },
            { value: "habitacion", valueToDisplay: "Room Service" },
            { value: "mostrador", valueToDisplay: "Mostrador" },
        ],
    },
    {
        value: "Productos vendidos",
    },
    {
        value: "Método de pago",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_tipos_pago", valueToDisplay: "Todos" },
            { value: "visa_o_mastercard", valueToDisplay: "Visa o mastercard" },
            { value: "efectivo", valueToDisplay: "Efectivo" },
            { value: "amex", valueToDisplay: "AMEX" },
            { value: "consumo_interno", valueToDisplay: "Consumo interno" },
            { value: "cortesia", valueToDisplay: "Cortesía" },
        ],
    },
    {
        value: "Total",
    },

    {
        value: "Ticket",
    },
]

export const headersCanceladas: FlexibleTableHeaderColumn[] = [
    {
        value: "Orden",
    },
    {
        value: "Tipo de venta",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_tipos_venta", valueToDisplay: "Todas" },
            { value: "habitacion", valueToDisplay: "Room Service" },
            { value: "mostrador", valueToDisplay: "Mostrador" },
        ],
    },
    {
        value: "Turno",
        isFilterUnique: true,
        filterMenu: [
            { value: "todos_turnos", valueToDisplay: "Todos" },
            { value: "matutino", valueToDisplay: "Matutino" },
            { value: "vespertino", valueToDisplay: "Vespertino" },
            { value: "nocturno", valueToDisplay: "Nocturno" },
        ],
    },
    {
        value: "Fecha y hora de venta",
    },
    {
        value: "Productos vendidos",
    },
    {
        value: "Total",
    },
    {
        value: "Ticket",
    },
]

export const ordersHeaders = {
    todas: allOrdersHeaders,
    pagadas: headersPagadas,
    pendientes: headersPendientes,
    canceladas: headersCanceladas,
}
