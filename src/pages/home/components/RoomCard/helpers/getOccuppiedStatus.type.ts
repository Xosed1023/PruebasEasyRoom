import { IconNameType } from "src/shared/types/IconNameType"

export enum MainTimerValue {
    rentaASC = 1,
    rentaDESC = 2,
    payASC = 3,
}

export enum rsTimerValue {
    ASC = 1,
    ASCExcedido = 2,
    NA = 3,
}

export type OccuppiedCardStatus = {
    icon: IconNameType
    mainTimer: MainTimerValue
    rsTimer: rsTimerValue
    alert: boolean
}
