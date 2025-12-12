import { useMemo } from "react"

export type UseTotalParams = {
    estancia: any[]
    ordenes: any[]
    key: string
}

export function useTotal({ estancia, ordenes, key }: UseTotalParams) {
    const totalEstancia = estancia.reduce((sum, estancia) => {
        return sum + Number(estancia.total || 0)
    }, 0)
    const totalOrdenes = ordenes.reduce((sum, orden) => {
        return sum + (orden.saldo_pendiente || 0)
    }, 0)

    const total = useMemo(() => (key === "Estancia" ? totalEstancia : totalOrdenes), [key, totalEstancia, totalOrdenes])

    return {
        total,
    }
}
