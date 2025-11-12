import { ReactNode } from "react"

export interface TableRow {
    value: {
        value: string | ReactNode
    }[]
}
