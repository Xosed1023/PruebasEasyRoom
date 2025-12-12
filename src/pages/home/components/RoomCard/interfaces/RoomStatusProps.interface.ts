import { EstadosOrdenHistorial, EstadosRentas } from "src/gql/schema"
import { RoomStatus } from "../enums/RoomStatus.enum"

export interface RoomStatusProps {
    supervisionTimeEnd?: string
    supervisionTimeStart?: string
    supervisionColaboradorName?: string
    supervisionColaboradorPhotoUrl?: string
    roomServiceTimeStart?: string
    roomServiceTimeEnd?: string
    reservedTimeStart?: string
    reservedTimeEnd?: number
    timeValue?: number
    timeLimit?: number
    extraTime?: number
    details?: string
    gestIn?: boolean
    timeout?: boolean
    fecha_antigua_por_entregar?: string
    // Atributos conectados al backend
    cleaningTimeStart?: string
    cleaningTimeEnd?: string
    cleaningTimeSalida?: string
    cleaningColaboradorNames?: { nombre: string; apellido_paterno: string; apellido_materno: string }[]
    maintenanceColaboradorName?: string
    cleaningColaboradorPhotosUrl?: string[]
    maintenanceColaboradorPhotoUrl?: string
    dateStatusChanged?: string
    roomTypeName: string
    roomNumber: string
    roomStatus: RoomStatus
    lastRentStatus: EstadosRentas
    roomId: string
    placas?: string
    comentarioUltimoBloqueo?: string
    occupiedTimeStart?: string
    occupiedTimeEnd?: string
    occupiedExtraHours?: number
    occupiedTimeEndCondensada?: string
    // este puede cambiar
    clientName?: string
    peopleNum?: number
    reservedClientName?: string
    reservedStartDate?: string
    reservedCheckinDate?: Date
    reservedCheckOutDate?: Date
    reservedEndDate?: string
    reservedDetails?: string
    maintenanceDetails?: string
    reservedPeopleNum?: number
    uncleanTimeLimit?: Date
    supervisionTimeLimit?: Date
    supervisionPendingTimeLimit?: Date
    hasIncidences?: boolean
    room?: any
    easyrewards?: string
    ultimaOrden?: {
        orden_activa: boolean
        orden?: {
            fecha_registro: string
            estado_orden: EstadosOrdenHistorial
        }
    }
    isSelected?: boolean
    zonaHoraria: string 
}
