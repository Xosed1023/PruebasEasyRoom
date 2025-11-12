import { Estados_Habitaciones } from "src/gql/schema"

export const validStatusToMaintenanceOrClean = (texto: string): boolean => {
    const validToMaintenance = {
        [Estados_Habitaciones.ALaVenta]: Estados_Habitaciones.ALaVenta,
        [Estados_Habitaciones.Preparada]: Estados_Habitaciones.Preparada,
        [Estados_Habitaciones.SupervisionPendiente]: Estados_Habitaciones.SupervisionPendiente,
        [Estados_Habitaciones.Sucia]: Estados_Habitaciones.Sucia,
        [Estados_Habitaciones.Bloqueada]: Estados_Habitaciones.Bloqueada,
    }
    return validToMaintenance[texto]
}