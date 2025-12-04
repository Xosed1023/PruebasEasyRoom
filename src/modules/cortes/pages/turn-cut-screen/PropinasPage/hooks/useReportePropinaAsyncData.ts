import { dateHelpers } from "@/helpers/dateHelpers"
import { useProfile } from "@/hooks/store/useProfile"
import { useParams } from "react-router"
import { Exact, ReportePropinasQuery, Scalars, useReportePropinasLazyQuery } from "src/gql/schema"
import { getName } from "../../../helpers/getName"
import { getCurrencyFormat } from "../../../helpers/currency"
import { formatDateComplitSlash } from "@/helpers/formatDate-DD-MM-YY"
import { LazyQueryExecFunction, QueryResult } from "@apollo/client"

type ResReporte = QueryResult<
    ReportePropinasQuery,
    Exact<{
        hotel_id: Scalars["ID"]["input"]
    }>
>

type UseReportePropinasParams = {
    whiteSpace?: boolean
    getReporte: LazyQueryExecFunction<
        ReportePropinasQuery,
        Exact<{
            hotel_id: Scalars["ID"]["input"]
        }>
    >
}

export const useFetchReporte = ({ hotel_id = "" }) => {
    const [getReporte] = useReportePropinasLazyQuery({
        variables: {
            hotel_id,
        },
    })

    return { getReporte }
}

export function useReportePropinasAsyncData({ whiteSpace = true, getReporte }: UseReportePropinasParams) {
    const { diffDays } = dateHelpers()
    const { hotel_id = "" } = useParams()

    const {
        usuario: { hotel },
    } = useProfile()
    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)
    const getFixedNumber = (number: any) => Number(Number(number || 0).toFixed(2))

    const getVentas = (array: any[]) => {
        const ventas = {
            estancia: 0,
            alimentos: 0,
            bebidas: 0,
            sex_spa: 0,
            otros: 0,
        }

        array.forEach(({ categoria = "", monto = 0 }) => {
            const monto_total = getFixedNumber(monto)
            if ("Estancia".includes(categoria)) {
                ventas.estancia += monto_total
            } else if ("Alimentos".includes(categoria)) {
                ventas.alimentos += monto_total
            } else if ("Bebidas".includes(categoria)) {
                ventas.bebidas += monto_total
            } else if ("Sex & Spa".includes(categoria)) {
                ventas.sex_spa += monto_total
            } else {
                ventas.otros += monto_total
            }
        })

        return ventas
    }

    const getTotals = ({ res }: { res: ResReporte }) => {
        const totals = {
            estancia: 0,
            alimentos: 0,
            bebidas: 0,
            sex_spa: 0,
            otros: 0,
            propinas_venta: 0,
            puntos_a_pagar: 0,
            comision_bancaria_tarjeta: 0,
            total_a_repartir: 0,
        }
        const base = res.data?.reporte_propinas?.reporte_propinas || []

        base.forEach((item) => {
            item?.reporte_colaboradores?.forEach((i) => {
                const { estancia, alimentos, bebidas, sex_spa, otros } = getVentas(i?.ventas_por_categoria || [])
                totals.estancia += estancia
                totals.alimentos += alimentos
                totals.bebidas += bebidas
                totals.sex_spa += sex_spa
                totals.otros += otros
                totals.propinas_venta += getFixedNumber(i?.propinas_tarjetas_por_venta_rs)
                totals.puntos_a_pagar += getFixedNumber(i?.puntos_a_pagar)
                totals.comision_bancaria_tarjeta += getFixedNumber(i?.comision_bancaria_tarjeta)
                totals.total_a_repartir += getFixedNumber(i?.total_a_repartir)
            })
        })

        return totals
    }

    const getData = ({ res }: { res: ResReporte }) => {
        const base = res.data?.reporte_propinas?.reporte_propinas || []

        return base.map((item) => {
            return {
                section: item?.puesto?.nombre || "",
                values: item?.reporte_colaboradores.map((i) => {
                    const { estancia, alimentos, bebidas, sex_spa, otros } = getVentas(i?.ventas_por_categoria || [])
                    return {
                        value: [
                            getName(i.colaborador),
                            estancia ? getCurrencyFormat(estancia) : "-",
                            alimentos ? getCurrencyFormat(alimentos) : "-",
                            bebidas ? getCurrencyFormat(bebidas) : "-",
                            sex_spa ? getCurrencyFormat(sex_spa) : "-",
                            otros ? getCurrencyFormat(otros) : "-",
                            i?.propinas_tarjetas_por_venta_rs
                                ? getCurrencyFormat(getFixedNumber(i?.propinas_tarjetas_por_venta_rs))
                                : "-",
                            i?.puntos_a_pagar ? getCurrencyFormat(getFixedNumber(i?.puntos_a_pagar)) : "-",
                            i?.comision_bancaria_tarjeta
                                ? getCurrencyFormat(getFixedNumber(i?.comision_bancaria_tarjeta))
                                : "-",
                            i?.total_a_repartir ? getCurrencyFormat(getFixedNumber(i?.total_a_repartir)) : "-",
                            ...(whiteSpace ? [""] : []),
                        ],
                    }
                }),
            }
        })
    }

    const formatTotals = ({ res }: { res: ResReporte }) => {
        const {
            estancia,
            alimentos,
            bebidas,
            sex_spa,
            otros,
            propinas_venta,
            puntos_a_pagar,
            comision_bancaria_tarjeta,
            total_a_repartir,
        } = getTotals({ res })
        return [
            "Total",
            getCurrencyFormat(estancia),
            getCurrencyFormat(alimentos),
            getCurrencyFormat(bebidas),
            getCurrencyFormat(sex_spa),
            getCurrencyFormat(otros),
            getCurrencyFormat(propinas_venta),
            getCurrencyFormat(puntos_a_pagar),
            getCurrencyFormat(comision_bancaria_tarjeta),
            getCurrencyFormat(total_a_repartir),
            ...(whiteSpace ? [""] : []),
        ]
    }

    const getDates = ({ fecha_inicio, fecha_fin }: { fecha_inicio: string; fecha_fin: string }) => {
        const date = new Date()
        const fechaInicio = fecha_inicio || date.toISOString()
        const fechaFin = fecha_fin || date.toISOString()
        const days = diffDays(new Date(fechaInicio), new Date(fechaFin)) || 0
        return [
            { label: "Fecha inicio", value: formatDateComplitSlash(fechaInicio) },
            { label: "Fecha término", value: formatDateComplitSlash(fechaFin || fechaInicio) },
            { label: "Días", value: days ? `${days}` : "1" },
        ]
    }

    const getTurnCutData = ({ fecha_inicio, fecha_fin }: { fecha_inicio: string; fecha_fin: string }) => {
        return getReporte().then((res) => {
            return {
                data: getData({ res }),
                totals: formatTotals({ res }),
                logo_hotel: hotelSelected?.logo_hotel || "",
                nombre_hotel: hotelSelected?.nombre_hotel?.toUpperCase() || "",
                dates: getDates({ fecha_fin, fecha_inicio }),
                res: res.data?.reporte_propinas?.reporte_propinas,
            }
        })
    }

    return {
        getTurnCutData,
    }
}
