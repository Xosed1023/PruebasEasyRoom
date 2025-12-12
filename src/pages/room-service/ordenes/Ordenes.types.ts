export interface OrdenesRow {
    goTo: string
    value: {
        value: string | JSX.Element
    }[]
}

export interface Tabs {
    label: string
    path: string
    number: number
}
export enum OrigenOrden {
    RoomService = "room_service",
    Mostrador = "mostrador",
    Restaurante = "restaurante",
}

export type OrdenesPaths = "todas" | "room_service" | "mostrador" | "restaurante"

export interface OrdenesTabs {
    label: string
    path: string
    number: number
}
