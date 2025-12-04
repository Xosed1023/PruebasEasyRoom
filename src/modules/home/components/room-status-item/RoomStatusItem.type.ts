import { ReactNode } from "react"

export interface RoomStatusItemProps {
    title: string
    value: number
    icon: ReactNode
    iconColor: string
    loading?: boolean
}
