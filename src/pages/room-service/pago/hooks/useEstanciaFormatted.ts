import { useMemo } from "react"

export type FormattedEstancia = {
    usuario_id: string
    folio: string
    detalle: string
    precio: number
    cantidad: number
    iva: number
    total: number
    easyrewards_id: string | null
    colaborador: {
        colaborador_id: string
        nombre: string
    }
    extras?: {
        extra_id: string
        detalle: string
        precio: number
        cantidad: number
        iva: number
        total: number
    }[]
    extrasId: string[]
}

export function useEstanciaFormatted(selectedEstancia: any[]) {
    const formatted = useMemo(() => {
        return selectedEstancia.map((item) => {
            const colaborador = item.colaborador
                ? { colaborador_id: item.colaborador.colaborador_id, nombre: item.colaborador.nombre }
                : { colaborador_id: "", nombre: "" }

            const isExtra = (detalle: string) => {
                const extras = detalle.toLowerCase()
                return (
                    extras.includes("extra") &&
                    (extras.includes("persona") || extras.includes("hospedaje") || extras.includes("hora"))
                )
            }

            if (item.conceptos?.length) {
                const [firstConcepto, ...restConceptos] = item.conceptos
                return {
                    usuario_id: item.usuario_id,
                    folio: item.folio,
                    detalle: firstConcepto.detalle || "",
                    precio: firstConcepto.precio || 0,
                    cantidad: firstConcepto.cantidad || 0,
                    iva: firstConcepto.iva || 0,
                    total: item.conceptos.reduce((acc, c) => acc + (c.total || 0), 0),
                    easyrewards_id: item.easyrewards_id || null,
                    colaborador,
                    extras: restConceptos.length
                        ? restConceptos.map((extra: any) => ({
                            extra_id: extra.extra_id,
                            detalle: extra.detalle,
                            precio: extra.precio,
                            cantidad: extra.cantidad,
                            iva: extra.iva,
                            total: extra.total,
                        }))
                        : [],
                    extrasId: item.conceptos
                        .filter((c: any) => c.extra_id && isExtra(c.detalle || ""))
                        .map((c: any) => c.extra_id),
                }
            }
            if (item.extras_checkin) {
                const extrasTotal = item.extras_checkin.reduce((acc, e) => acc + (e.total || 0), 0)
                return {
                    usuario_id: item.usuario_id,
                    folio: item.folio,
                    detalle: item.detalle || "",
                    precio: item.precio || 0,
                    cantidad: item.cantidad || 0,
                    iva: item.iva || 0,
                    total: (item.total || 0) + extrasTotal,
                    easyrewards_id: item.easyrewards_id || null,
                    colaborador,
                    extras: item.extras_checkin.length
                        ? item.extras_checkin.map((extra: any) => ({
                            extra_id: extra.extra_id,
                            detalle: extra.detalle,
                            precio: extra.precio,
                            cantidad: extra.cantidad,
                            iva: extra.iva,
                            total: extra.total,
                        }))
                        : [],
                    extrasId: item.extras_checkin
                        .filter((e) => e.extra_id && isExtra(e.detalle || ""))
                        .map((e) => e.extra_id),
                }
            }

            return {
                usuario_id: item.usuario_id,
                folio: item.folio,
                detalle: item.detalle || "",
                precio: item.precio || 0,
                cantidad: item.cantidad || 0,
                iva: item.iva || 0,
                total: item.total || 0,
                easyrewards_id: item.easyrewards_id || null,
                colaborador,
                extras: [],
                extrasId: [],
            }
        })
    }, [selectedEstancia])

    return formatted
}
