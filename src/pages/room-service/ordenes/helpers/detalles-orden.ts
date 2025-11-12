import { EstadosDetalleOrden, EstadosOrdenHistorial } from "src/gql/schema";

export function getFilterDetalles(orden: any): any[] {
    const detalles_orden = orden?.detalles_orden || []
    const estado = orden?.estado_orden as EstadosOrdenHistorial
    if (estado !== EstadosOrdenHistorial.Cancelada) {
        return detalles_orden?.filter((d) => 
            d?.estado !== EstadosDetalleOrden.Cancelada && 
            d?.estado !== EstadosDetalleOrden.CanceladaEdicion
        )
    } 

    return detalles_orden?.filter((d) => d?.estado !== EstadosDetalleOrden.CanceladaEdicion)
}