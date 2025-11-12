import { ReactNode } from "react"

export interface IncidenciaRow {
    goTo: string
    value: {
        value: ReactNode
    }[]
}

export interface Tabs {
    label: string
    path: string
    number: number
}
