import { MainTimerValue, OccuppiedCardStatus, rsTimerValue } from "./getOccuppiedStatus.type"
import {
    StatusEstanciaExtraTypes,
    StatusIsUsingExtraTime,
    StatusPagoTypes,
    StatusPagoTypesWithoutPagada,
    StatusPersonaExtraTypes,
    StatusRoomServiceTypes,
    StatusTypes,
} from "./occuppied-status-helpers/status.type"

const StatusRentaType = StatusTypes
const StatusPagoPendienteRenta = StatusPagoTypes
const StatusTimerRoomService = StatusTypes
const StatusRoomService = StatusRoomServiceTypes
const StatusPagoRoomService = StatusPagoTypes
const StatusPersonaExtra = StatusPersonaExtraTypes
const StatusEstanciaExtra = StatusEstanciaExtraTypes
const StatusPagoPendientePersonaExtra = StatusPagoTypesWithoutPagada
const StatusPagoPendienteEstanciaExtra = StatusPagoTypesWithoutPagada
// IconRoomServicePendingPayment

export const values: Record<string, OccuppiedCardStatus> = {
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 2 - item 1
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 3 - item 2
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 4 - item 3
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 5 - item 4
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 6 - item 5
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 7 - item 6
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 8 - item 7
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 9 - item 8
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 10 - item 9
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 11 - item 10
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 12 - item 11
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 13 - item 12
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 14 - item 13
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 15 - item 14
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 16 - item 15
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 17 - item 16
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 18 - item 17
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 19 - item 18
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 20 - item 19
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 21 - item 20
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 22 - item 21
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 23 - item 22
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 24 - item 23
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 25 - item 24
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 26 - item 25
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 27 - item 26
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 28 - item 27
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 29 - item 28
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 30 - item 29
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 31 - item 30
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 32 - item 31
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 33 - item 32
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 34 - item 33
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 35 - item 34
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 36 - item 35
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 37 - item 36
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 38 - item 37
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 39 - item 38
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 40 - item 39
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 41 - item 40
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 42 - item 41
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 43 - item 42
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 44 - item 43
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 45 - item 44
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 46 - item 45
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 47 - item 46
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 48 - item 47
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 49 - item 48
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 50 - item 49
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 51 - item 50
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 52 - item 51
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 53 - item 52
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 54 - item 53
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 55 - item 54
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 56 - item 55
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 57 - item 56
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 58 - item 57
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 59 - item 58
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 60 - item 59
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 61 - item 60
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 62 - item 61
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 63 - item 62
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 64 - item 63
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 65 - item 64
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 66 - item 65
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 67 - item 66
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 68 - item 67
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 69 - item 68
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 70 - item 69
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 71 - item 70
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 72 - item 71
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 73 - item 72
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 74 - item 73
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        }, // fila 75 - item 74
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 76 - item 75
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        }, // fila 77 - item 76
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Pagada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Oder",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        }, // fila 78 - item 77
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 79 - item 78
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 80 - item 79
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 81 - item 80
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 82 - item 81
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 83 - item 82
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 84 - item 83
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 85 - item 84
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 86 - item 85
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 87 - item 86
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 88 - item 87
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 89 - item 88
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 90 - item 89
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 91 - item 90
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 92 - item 91
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 93 - item 92
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 94 - item 93
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 95 - item 94
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 96 - item 95
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 97 - item 96
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 98 - item 97
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 99 - item 98
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 100 - item 99
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 101 - item 100
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        }, // fila 102 - item 101
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 103 - item 102
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 104 - item 103
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 105 - item 104
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.Entregada}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        }, // fila 106 - item 105
    // **********************************************************
    // CASOS NO DOCUMENTADOS EN EXCEL
    // **********************************************************
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "ExtraTimeIcon",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "BedFilled",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaDESC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.NoExpirada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NoExpirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.ASC,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Expirada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.rentaASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.rentaDESC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.NoExpirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: false,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NA}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NA}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.NoExpirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.PorEntregar}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "Order",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NoExpirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.NA}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.Expirada}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.Expirada}-${StatusIsUsingExtraTime.Yes}`]:
        {
            icon: "IconPendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.Expirada}-${StatusRoomService.EnPreparacion}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "RecipeHistory",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.ASCExcedido,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.Expirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.NoExpirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]:
        {
            icon: "IconRoomServicePendingPayment",
            mainTimer: MainTimerValue.payASC,
            alert: true,
            rsTimer: rsTimerValue.NA,
        },
    defaultNoExpirada: {
        icon: "BedFilled",
        mainTimer: MainTimerValue.rentaDESC,
        alert: false,
        rsTimer: rsTimerValue.NA,
    },
    defaultExpirada: {
        icon: "BedFilled",
        mainTimer: MainTimerValue.rentaASC,
        alert: true,
        rsTimer: rsTimerValue.NA,
    },
}

// [`${StatusRentaType.NoExpirada}-${StatusPagoPendienteRenta.Pagada}-${StatusTimerRoomService.NA}-${StatusRoomService.NA}-${StatusPagoRoomService.Expirada}-${StatusPersonaExtra.NoExpirada}-${StatusEstanciaExtra.NA}-${StatusPagoPendientePersonaExtra.Expirada}-${StatusPagoPendienteEstanciaExtra.NA}-${StatusIsUsingExtraTime.No}`]

// {statusRenta: 2}
// {statusPagoPendienteRenta: 3}
// {statusTimerRoomService:3}
// {statusRoomService: 3}
// {statusPagoRoomService: 1}
// {statusPersonaExtra: 3}
// {statusEstanciaExtra: 3}
// {statusPagoPendientePersonaExtra: 1}
// {statusPagoPendienteEstanciaExtra: 4}
// {isUsingExtraTime: 2}
