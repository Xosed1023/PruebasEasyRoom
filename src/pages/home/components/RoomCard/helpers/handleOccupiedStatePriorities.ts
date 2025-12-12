import {
    StatusEstanciaExtraTypes,
    StatusIsUsingExtraTime,
    StatusPagoTypes,
    StatusRoomServiceTypes,
    StatusTypes,
} from "./occuppied-status-helpers/status.type"
import { OccupiedStatus } from "../interfaces/OccupiedState"
import { MainTimerValue, rsTimerValue } from "./getOccuppiedStatus.type"

const handleOccupiedStatePriorities = ({
    isUsingExtraTime,
    statusEstanciaExtra,
    statusPagoPendienteEstanciaExtra,
    statusPagoPendientePersonaExtra,
    statusPagoPendienteRenta,
    statusPagoRoomService,
    statusRenta,
    statusRoomService,
    statusTimerRoomService,
    olderConceptoPendiente,
}: {
    statusRenta: StatusTypes.Expirada | StatusTypes.NoExpirada
    statusPagoPendienteRenta: StatusPagoTypes.Expirada | StatusPagoTypes.NoExpirada | StatusPagoTypes.Pagada
    statusTimerRoomService: StatusTypes
    statusRoomService: StatusRoomServiceTypes
    statusPagoRoomService: StatusPagoTypes
    statusEstanciaExtra: StatusEstanciaExtraTypes
    statusPagoPendientePersonaExtra: StatusPagoTypes.Expirada | StatusPagoTypes.NoExpirada | StatusPagoTypes.NA
    statusPagoPendienteEstanciaExtra: StatusPagoTypes.Expirada | StatusPagoTypes.NoExpirada | StatusPagoTypes.NA
    isUsingExtraTime: StatusIsUsingExtraTime
    olderConceptoPendiente: {
        type: "extra" | "renta" | "orden"
        date: Date
    } | null
}): OccupiedStatus => {
    if ([StatusRoomServiceTypes.EnPreparacion, StatusRoomServiceTypes.PorEntregar].includes(statusRoomService)) {
        return {
            icon: statusRoomService === StatusRoomServiceTypes.EnPreparacion ? "RecipeHistory" : "Order",
            alert: statusTimerRoomService === StatusTypes.Expirada,
            mainTimer: statusRenta === StatusTypes.Expirada ? MainTimerValue.rentaASC : MainTimerValue.rentaDESC,
            rsTimer: statusTimerRoomService === StatusTypes.Expirada ? rsTimerValue.ASCExcedido : rsTimerValue.ASC,
        }
    }

    return {
        icon:
            [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoRoomService) &&
                  olderConceptoPendiente?.type === "orden"
                ? "IconRoomServicePendingPayment"
                : [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoPendienteRenta) &&
                  olderConceptoPendiente?.type === "renta"
                ? "IconPendingPayment"
                : [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoPendienteEstanciaExtra) &&
                  olderConceptoPendiente?.type === "extra"
                ? "IconPendingPayment"
                : [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoPendientePersonaExtra) &&
                  olderConceptoPendiente?.type === "extra"
                ? "IconPendingPayment"
                : isUsingExtraTime === StatusIsUsingExtraTime.Yes
                ? "ExtraTimeIcon"
                : "BedFilled",
        mainTimer:
            [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoPendienteRenta) ||
            [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoPendientePersonaExtra) ||
            [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoRoomService) ||
            [StatusPagoTypes.Expirada, StatusPagoTypes.NoExpirada].includes(statusPagoPendienteEstanciaExtra)
                ? MainTimerValue.payASC
                : statusRenta === StatusTypes.Expirada
                ? MainTimerValue.rentaASC
                : MainTimerValue.rentaDESC,
        alert:
            statusPagoPendienteRenta === StatusPagoTypes.Expirada && olderConceptoPendiente?.type === "renta"
                ? true
                : (statusPagoPendienteEstanciaExtra === StatusPagoTypes.Expirada ||
                      statusPagoPendientePersonaExtra === StatusPagoTypes.Expirada) &&
                  olderConceptoPendiente?.type === "extra"
                ? true
                : statusPagoRoomService === StatusPagoTypes.Expirada && olderConceptoPendiente?.type === "orden"
                ? true
                : statusEstanciaExtra === StatusEstanciaExtraTypes.Expirada
                ? true
                : statusRenta === StatusTypes.Expirada
                ? true
                : false,
        rsTimer: rsTimerValue.NA
    }
}

export default handleOccupiedStatePriorities
