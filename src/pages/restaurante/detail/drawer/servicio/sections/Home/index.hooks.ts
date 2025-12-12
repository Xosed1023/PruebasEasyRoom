import { useMemo } from "react"
import { EstadosOrdenHistorial } from "src/gql/schema"
import { useClearRepeatItems } from "src/pages/home/room-detail/drawer/ocupada/sections/tabs/roomService/hooks"

export function useMesaOrdenes(preparacion: any[], entregar: any[], entregada: any[]) {
    const { getItemsFormat } = useClearRepeatItems()

    const res = useMemo(() => {
        return {
            data: [
                {
                    title: `En preparación (${preparacion.length})`,
                    empty: "No hay productos en preparación",
                    logo: "RecipeHistory",
                    key: EstadosOrdenHistorial.EnPreparacion,
                    ordenes: getItemsFormat(preparacion),
                },
                {
                    title: `Por entregar (${entregar.length})`,
                    empty: "No hay productos por entregar",
                    logo: "roomServiceCommand",
                    key: EstadosOrdenHistorial.PorEntregar,
                    ordenes: getItemsFormat(entregar),
                },
                {
                    title: `Entregado (${entregada.length})`,
                    empty: "No hay productos entregados",
                    logo: "WaiterKitchenFilled",
                    key: EstadosOrdenHistorial.Entregada,
                    ordenes: getItemsFormat(entregada),
                },
            ],
            length: preparacion.length + entregar.length + entregada.length,
        }
    }, [preparacion, entregada, entregar])

    return res
}
