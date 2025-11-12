import { EstadosOrdenHistorial } from "src/gql/schema"
import { OrigenOrden } from "../Ordenes.types"

export function getEstadoOrden(origen_orden: string, estado_orden: string) {
    const paths = [EstadosOrdenHistorial.Entregada, EstadosOrdenHistorial.Cancelada]
    return origen_orden === OrigenOrden.Restaurante && !paths.includes(estado_orden as EstadosOrdenHistorial)
        ? "en_servicio"
        : estado_orden
}
