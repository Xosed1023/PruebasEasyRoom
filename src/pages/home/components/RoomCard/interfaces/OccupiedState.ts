import { IconNameType } from "src/shared/types/IconNameType"
import { MainTimerValue, rsTimerValue } from "../helpers/getOccuppiedStatus.type"

export interface OccupiedStatus {
    icon: IconNameType
    mainTimer: MainTimerValue
    alert: boolean
    rsTimer: rsTimerValue
}
