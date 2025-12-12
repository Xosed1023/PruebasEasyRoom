import { ReactNode } from "react"

export interface FlexibleTableItems {
    headers: FlexibleTableHeaderColumn[]
    rows: FlexibleTableRow[]
    sort?: boolean
}

export interface FlexibleTableHeaderColumn {
    // restraso en el evento onChange en el buscador para no hacer peticiones innecesarias
    debounceSearchMSTime?: number
    // Lista de items que al seleccionar uno la tabla realiza su filtro
    filterMenu?: FilterMenuItem[]
    isFilterUnique?: boolean
    sort?: boolean
    // Valor que se va a mostrar en el header de la tabla
    valueToDisplay?: string | ReactNode
    // valor que se toma en cuenta para la logica de los filtros y ordenamientos, si no existe valueToDisplay value también se va a mostar como texto en el header
    value: string
    // flag para activar el modo filtro predictivo
    filterSuggetions?: boolean
    onInputFilterSuggestionChange?: ({ headerValue, value }: { headerValue: string; value: string }) => void
    // Evento para disparar la carga personalizada de más filtros
    onLoadMore?: () => void
}

export interface FilterMenuItem {
    // value: atributo por el que la tabla va a realizar el filtro
    value: string
    // valueToDisplay: atributo que se va a ver en la lista de opciones de filtro
    valueToDisplay: string
}

export interface FlexibleTableRow {
    key?: string | number
    highlighted?: boolean
    goTo?: string
    className?: string
    value: FlexibleTableColumn[]
    sort?: boolean
}

export interface FlexibleTableColumn {
    key?: string
    boldText?: boolean
    disabled?: boolean
    className?: string
    value: JSX.Element | string | ReactNode
    sortValue?: string
    fromHeaderSort?: string
    filterValue?: string
    fromHeaderFilter?: string
}

export interface ItemsTabsValues {
    className?: string
    style?: React.CSSProperties
    label?: string
    timer?: string
    active?: boolean
    onClick?: () => void | undefined
}
