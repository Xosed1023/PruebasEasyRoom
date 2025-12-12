import { COLLECTION } from "src/shared/icons/Icon"

export interface RoomCardHeaderProps {
    iconName: keyof typeof COLLECTION | (string & {})
    roomTypeName: string
    hasIncidences?:boolean
    roomNumber: string
    roomTypeAbbreviation?: string
    description?: string
    roomService?: boolean
    timeout?: boolean
    iconBgColor?: string
    iconBgSecondaryColor?: string
    easyrewards?: string
    orderTimer?: string
}
