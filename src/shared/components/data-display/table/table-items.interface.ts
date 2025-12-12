import { ReactNode } from "react"

export interface TableItems {
    headers: TableHeaderColumn[]
    rows: TableRow[]
    sort?: boolean
}

export interface TableHeaderColumn {
    // Lista de items que al seleccionar uno la tabla realiza su filtro
    filterMenu?: FilterMenuItem[]
    // Valor que se va a mostrar en el header de la tabla
    value: string
    sort?: boolean
}

export interface FilterMenuItem {
    // value: atributo por el que la tabla va a realizar el filtro
    value: string
    // valueToDisplay: atributo que se va a ver en la lista de opciones de filtro
    valueToDisplay: string
    sort?: boolean
}

export interface TableRow {
    key?: string | number
    seen?: boolean
    highlighted?: boolean
    goTo?: string
    value: TableColumn[]
    onSort?: (value) => void
}

export interface TableColumn {
    key?: string | number
    className?: string
    boldText?: boolean
    value: string | ReactNode
}
