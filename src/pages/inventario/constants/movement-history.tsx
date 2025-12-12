import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { Option } from "src/shared/components/forms/selelct-dropdown/Dropdown"

const folioHeader = [
    {
        value: "",
        valueToDisplay: "Todos",
    },
    {
        value: "insumo",
        valueToDisplay: "Insumo",
    },
    {
        value: "venta",
        valueToDisplay: "Producto",
    },
    {
        value: "proceso",
        valueToDisplay: "Proceso",
    },
]

const movementHeader = [
    {
        value: "",
        valueToDisplay: "Todos",
    },
    {
        value: "entrada",
        valueToDisplay: "Entrada",
    },
    {
        value: "salida",
        valueToDisplay: "Salida",
    },
]

const typeHeader = [
    {
        value: "",
        valueToDisplay: "Todos",
    },
    {
        value: "nuevo",
        valueToDisplay: "Nuevo",
    },
    {
        value: "resurtido",
        valueToDisplay: "Resurtido",
    },
    {
        value: "proceso",
        valueToDisplay: "Proceso",
    },
    {
        value: "venta",
        valueToDisplay: "Venta",
    },
    {
        value: "transferencia",
        valueToDisplay: "Transferencia",
    },
    {
        value: "consumo_interno",
        valueToDisplay: "Consumo interno",
    },
    {
        value: "receta",
        valueToDisplay: "Receta",
    },
    {
        value: "merma",
        valueToDisplay: "Merma",
    },
    {
        value: "caducado",
        valueToDisplay: "Caducado",
    },
    {
        value: "devolucion",
        valueToDisplay: "Devolución",
    },
    {
        value: "faltante",
        valueToDisplay: "Faltante",
    },
]

export const options: Option[] = [
    { label: "Enero", value: "0" },
    { label: "Febrero", value: "1" },
    { label: "Marzo", value: "2" },
    { label: "Abril", value: "3" },
    { label: "Mayo", value: "4" },
    { label: "Junio", value: "5" },
    { label: "Julio", value: "6" },
    { label: "Agosto", value: "7" },
    { label: "Septiembre", value: "8" },
    { label: "Octubre", value: "9" },
    { label: "Noviembre", value: "10" },
    { label: "Diciembre", value: "11" },
]

export const currentDate = new Date()

export const movementType = {
    entrada: "Entrada",
    salida: "Salida",
}

export const headers: FlexibleTableHeaderColumn[] = [
    {
        value: "ID",
    },
    {
        valueToDisplay: "Artículo",
        value: "articulo",
        filterMenu: folioHeader,
        isFilterUnique: true,
    },
    {
        value: "Movimiento",
        filterMenu: movementHeader,
        isFilterUnique: true,
    },
    {
        value: "Tipo",
        filterMenu: typeHeader,
        isFilterUnique: true,
    },
    {
        value: "Origen/destino",
    },
    {
        value: "Cantidad",
    },
    {
        value: "Unidad",
    },
    {
        value: "Costo de unidad",
    },
    {
        value: "Fecha",
    },
]

export const tipo = {
    devolucion: "Devolucion",
    insumo_o_amenidad: "Insumo o amenidad",
    merma: "Merma",
    nuevo: "Nuevo",
    producto_caducado: "Producto caducado",
    producto_faltante: "Producto faltante",
    room_service: "Room service",
    resurtido: "Resurtido",
    caducado: "Caducado",
    consumo_interno: "Consumo Interno",
    faltante: "Faltante",
    proceso: "Proceso",
    receta: "Receta",
    transferencia: "Transferencia",
    venta: "Venta",
}
