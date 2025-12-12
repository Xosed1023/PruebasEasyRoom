import { useMemo } from "react"
import { usePDFParams } from "./params"
import { useDetalle_Reparto_PropinasQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { getCurrencyFormat } from "src/utils/string"
import { getName } from "src/pages/propinas/home/helpers/name"
import { useDate } from "src/shared/hooks/useDate"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

export function useData() {
    const { fecha_inicio, fecha_fin } = usePDFParams()
    const { hotel_id, logo_hotel, nombre_hotel } = useProfile()
    const { diffDays } = useDate()
    const { formatCustomDate } = useFormatDate()

    const { data: res, loading } = useDetalle_Reparto_PropinasQuery({
        variables: {
            hotel_id,
        },
    })

    const data = useMemo(() => {
        const base = res?.detalle_reparto_propinas?.detalle_reparto_propinas || []

        const puestos: string[] = base ? base?.map((item) => item?.colaborador?.puesto?.nombre || "") : []

        const clearList: string[] = Array.from(new Set(puestos)) || []

        return clearList.map((puesto) => {
            return {
                section: puesto,
                values: base
                    .filter((item) => item?.colaborador?.puesto?.nombre === puesto)
                    .map((i) => {
                        return {
                            value: [
                                getName(i?.colaborador),
                                i?.propina_recolectada ? getCurrencyFormat(i?.propina_recolectada) : "-",
                                i?.aportacion_a_fondo ? getCurrencyFormat(i?.aportacion_a_fondo) : "-",
                                i?.subtotal_propina_por_ventas
                                    ? getCurrencyFormat(i?.subtotal_propina_por_ventas)
                                    : "-",
                                i?.comision_bancaria_propina_por_venta
                                    ? getCurrencyFormat(i?.comision_bancaria_propina_por_venta)
                                    : "-",
                                i?.neto_propina_por_ventas ? getCurrencyFormat(i?.neto_propina_por_ventas) : "-",
                                i?.fondo_de_propina ? getCurrencyFormat(i?.fondo_de_propina) : "-",
                                i?.comision_bancaria_sobre_fondo
                                    ? getCurrencyFormat(i?.comision_bancaria_sobre_fondo)
                                    : "-",
                                i?.pago_correspondiente ? getCurrencyFormat(i?.pago_correspondiente) : "-",
                            ],
                        }
                    }),
            }
        })
    }, [res])

    const totals = useMemo(() => {
        const total = res?.detalle_reparto_propinas?.totales
        return [
            "Total",
            getCurrencyFormat(total?.total_propinas_recolectadas || 0),
            getCurrencyFormat(total?.total_aportaciones_a_fondo || 0),
            getCurrencyFormat(total?.total_subtotales_propina_por_ventas || 0),
            getCurrencyFormat(total?.total_comisiones_bancarias_propinas_por_ventas || 0),
            getCurrencyFormat(total?.total_neto_propinas_por_ventas || 0),
            getCurrencyFormat(total?.total_fondos_de_propina || 0),
            getCurrencyFormat(total?.total_comisiones_bancarias_sobre_fondo || 0),
            getCurrencyFormat(total?.total_pagos_correspondientes || 0),
        ]
    }, [res])

    const dates = useMemo(
        () => [
            {
                label: "Fecha inicio",
                value: formatCustomDate(fecha_inicio, "DD/MMM/"),
            },
            {
                label: "Fecha término",
                value: formatCustomDate(fecha_fin || fecha_inicio, "DD/MMM/YY"),
            },
            { label: "Días", value: fecha_fin ? `${diffDays(new Date(fecha_inicio), new Date(fecha_fin))}` : "1" },
        ],
        [fecha_inicio, fecha_fin]
    )

    return {
        data,
        totals,
        dates,
        loading,
        logo_hotel,
        nombre_hotel: nombre_hotel?.toUpperCase(),
    }
}
