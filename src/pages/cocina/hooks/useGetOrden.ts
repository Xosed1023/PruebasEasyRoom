import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export function useGetOrden() {
    const { ordersInPreparation } = useSelector((root: RootState) => root.ordersInPreparation)
    const { ordersToDeliver } = useSelector((root: RootState) => root.ordersToDeliver)

    const getOrden = (orden_id: string) => {
        const findInPreparation = ordersInPreparation.find((o) => o.orden_id === orden_id)
        const findInDeliver = ordersToDeliver.find((o) => o.orden_id === orden_id)

        const orden = {
            ...(findInPreparation || {}),
            ...(findInDeliver || {}),
            detalles_orden: [...(findInPreparation?.detalles_orden || []), ...(findInDeliver?.detalles_orden || [])],
        }

        return orden
    }

    return {
        getOrden,
    }
}
