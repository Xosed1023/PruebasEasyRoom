import { EstadoPagoOrdenes, EstadosOrdenHistorial, UltimosConceptosPendientesDetailOutput } from "src/gql/schema"
import getStatusEstanciaExtra from "./occuppied-status-helpers/getStatusEstanciaExtra"
import getStatusPagoPendienteEstanciaExtra from "./occuppied-status-helpers/getStatusPagoPendienteEstanciaExtra"
import getStatusPagoPendientePersonaExtra from "./occuppied-status-helpers/getStatusPagoPendientePersonaExtra"
import { getStatusPagoPendienteRenta } from "./occuppied-status-helpers/getStatusPagoPendienteRenta"
import getStatusPagoRoomService from "./occuppied-status-helpers/getStatusPagoRoomService"
import { getStatusRenta } from "./occuppied-status-helpers/getStatusRenta"
import getStatusRoomService from "./occuppied-status-helpers/getStatusRoomService"
import getStatusTimerRoomService from "./occuppied-status-helpers/getStatusTimerRoomService"
import { Maybe } from "graphql/jsutils/Maybe"
import getIsUsingExtraTime from "./occuppied-status-helpers/getIsUsingExtraTime"
import { OccupiedStatus } from "../interfaces/OccupiedState"
import handleOccupiedStatePriorities from "./handleOccupiedStatePriorities"

const getOccupiedStatus = ({
    ultimos_conceptos_pendientes,
    now,
    occupiedTimeEndCondensada,
    occupiedTimeEnd,
    roomNumber,
    ultimaOrden,
    olderConceptoPendiente,
    fecha_antigua_por_entregar 
}: {
    olderConceptoPendiente: {
        type: "extra" | "renta" | "orden"
        date: Date
    } | null
    now: Date
    roomNumber: string
    occupiedTimeEndCondensada: string
    ultimos_conceptos_pendientes: Maybe<UltimosConceptosPendientesDetailOutput>
    ultimaOrden:
        | {
              orden_activa: boolean
              orden?:
                  | {
                        fecha_registro: string
                        estado_pago?: EstadoPagoOrdenes
                        estado_orden: EstadosOrdenHistorial
                    }
                  | undefined
          }
        | undefined
    occupiedTimeEnd: string,
    fecha_antigua_por_entregar?: string | null
}) : OccupiedStatus => {
    const statusRenta = getStatusRenta({
        now,
        occupiedTimeEndCondensada,
    })
    const statusPagoPendienteRenta = getStatusPagoPendienteRenta({
        now,
        ultimos_conceptos_pendientes,
    })
    const statusTimerRoomService = getStatusTimerRoomService({
        now,
        fecha_registro_orden: ultimaOrden?.orden?.fecha_registro,
        fecha_antigua_por_entregar
    })
    const statusRoomService = getStatusRoomService({
        fecha_antigua_por_entregar,
        estado_orden: ultimaOrden?.orden?.estado_orden,
    })
    const statusPagoRoomService = getStatusPagoRoomService({
        // si es un depósito en garantía no cuenta como pago pendiente
        estado_pago: ultimos_conceptos_pendientes?.orden?.deposito
            ? undefined
            : ultimos_conceptos_pendientes?.orden?.estado_pago || ultimaOrden?.orden?.estado_pago || undefined,
        now,
        fecha_registro_ultima_orden: ultimos_conceptos_pendientes?.orden?.fecha_registro,
    })
    const statusEstanciaExtra = getStatusEstanciaExtra({
        now,
        occupiedTimeEndCondensada: occupiedTimeEndCondensada,
        occupiedTimeEnd,
    })
    const statusPagoPendientePersonaExtra = getStatusPagoPendientePersonaExtra({
        now,
        fecha_solicitud: ultimos_conceptos_pendientes?.extra?.fecha_solicitud,
        tipo_extra: ultimos_conceptos_pendientes?.extra?.tipo_extra,
    })
    const statusPagoPendienteEstanciaExtra = getStatusPagoPendienteEstanciaExtra({
        now,
        fecha_solicitud: ultimos_conceptos_pendientes?.extra?.fecha_solicitud,
        tipo_extra: ultimos_conceptos_pendientes?.extra?.tipo_extra,
    })

    const isUsingExtraTime = getIsUsingExtraTime({ now, occupiedTimeEnd, occupiedTimeEndCondensada, roomNumber })

    return handleOccupiedStatePriorities({
        isUsingExtraTime,
        olderConceptoPendiente,
        statusEstanciaExtra,
        statusPagoPendienteEstanciaExtra,
        statusPagoPendientePersonaExtra,
        statusPagoPendienteRenta,
        statusPagoRoomService,
        statusRenta,
        statusRoomService,
        statusTimerRoomService
    })
}

export default getOccupiedStatus
