import { Estados_Habitaciones } from "src/gql/schema";

export enum RoomStatus {
    reserved = Estados_Habitaciones.Reservada,
    maintenance = Estados_Habitaciones.Mantenimiento,
    blocked = Estados_Habitaciones.Bloqueada,
    unclean = Estados_Habitaciones.Sucia,
    occupiedCleaning = Estados_Habitaciones.Limpieza,
    cleaning = Estados_Habitaciones.Limpieza,
    carEntrance = Estados_Habitaciones.Ocupada,
    walkingEntrance = Estados_Habitaciones.Ocupada,
    roomService = Estados_Habitaciones.RoomService,
    occupied = Estados_Habitaciones.Ocupada,
    available = Estados_Habitaciones.ALaVenta,
    supervisionPending = Estados_Habitaciones.SupervisionPendiente,
    supervision = Estados_Habitaciones.Supervision,
    clean = Estados_Habitaciones.Preparada,
}
