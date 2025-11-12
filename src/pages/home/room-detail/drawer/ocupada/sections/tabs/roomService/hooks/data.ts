import { EstadosOrdenHistorial } from "src/gql/schema"

export function useData() {
    const getOrdersInfo = (ordenes: any[]) => {
        
        const ordenesPagadas: any[] = []
        const ordenesPendientes: any[] = []
        const ordenesPreparacion: any[] = []
        let totalPagado = 0
        let totalPendiente = 0
        let totalPropinas = 0
        
        ordenes?.forEach((orden) => {
            const { pago_id, propina, estado_orden, total_con_iva } = orden || {}

            const isCancelada = estado_orden === EstadosOrdenHistorial.Cancelada
            const isPreparacion = estado_orden === EstadosOrdenHistorial.EnPreparacion
            const isPagada = !!pago_id
            const totalOrden = Number(total_con_iva || 0)
            const totalPropinaOrden = Number(propina?.total || 0)

            if (isCancelada) return

            if (isPreparacion) {
                ordenesPreparacion.push(orden)
            }

            if (isPagada) {
                ordenesPagadas.push(orden)
                totalPagado += totalOrden
            } else {
                ordenesPendientes.push(orden)
                totalPendiente += totalOrden
            }

            if (totalPropinaOrden) {
                totalPropinas += totalPropinaOrden
            }
        })

        return {
            ordenesPagadas,
            ordenesPendientes,
            ordenesPreparacion,
            totalPagado,
            totalPendiente,
            totalPropinas,
        }
    }
    return {
        getOrdersInfo,
    }
}
