import { useEffect, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./Habitaciones.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import "../../Reports.css"
import { HabitacionesItems, TablaVentasArticulo } from "./Habitaciones.type"
import useHabitacionesHeader from "../hooks/useHabitacionesHeader"
import useTipoHabitacionesHeader from "../hooks/useTipoHabitacionHeader"
import useEstadoHabitacionHeader from "../hooks/useEstadoHabitacionHeader"
import { formatLowdashString } from "../../../../shared/helpers/formatLowdashString"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import useFormattedMeta from "../hooks/useFormattedMeta"
import { Stringify } from "src/shared/types/Stringify"
import useUsuarioHeader from "../hooks/useUsuarioHeader"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"

const HABITACION_HEADER_VALUE = "Habitación"
const TIPO_HABITACION_HEADER_VALUE = "Tipo de habitación"
const ESTADO_HABITACION_HEADER_VALUE = "Estado"
const USUARIO_HEADER_VALUE = "Usuario"

const Habitaciones = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const { data, refetch, load } = useFetch<HabitacionesItems>("/reportes/tabla_historial_habitaciones", {
        startFetch: false,
    })
    const [currentPage, setcurrentPage] = useState(1)
    const habitacionesHeader = useHabitacionesHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "habitacion",
        valueToDisplay: HABITACION_HEADER_VALUE,
    })
    const tiposHabitacionesHeader = useTipoHabitacionesHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "tipo_habitacion",
        valueToDisplay: TIPO_HABITACION_HEADER_VALUE,
    })
    const estadoHabitacionHeader = useEstadoHabitacionHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "estatus_habitacion",
        valueToDisplay: ESTADO_HABITACION_HEADER_VALUE,
    })
    const usuarioHeader = useUsuarioHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "usuario_actualiza",
        valueToDisplay: USUARIO_HEADER_VALUE,
    })
    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaVentasArticulo>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: ["fecha", "habitacion", "tipo_habitacion", "estatus_habitacion", "usuario_actualiza"],
        }),
        [filterValues, sortValue]
    )

    const { formattedMeta } = useFormattedMeta<Stringify<TablaVentasArticulo>>(formattedMetaValues)

    useEffect(() => {
        if (apiDateFilter?.length) {
            refetch({
                hotel_id,
                fecha_inicio: apiDateFilter[0],
                fecha_fin: apiDateFilter[1],
                take: 15,
                page: currentPage,
                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
            })
        }
    }, [apiDateFilter, currentPage, formattedMeta])

    const headers = [
        habitacionesHeader,
        tiposHabitacionesHeader,
        estadoHabitacionHeader,
        { value: "fecha", sort: true },
        usuarioHeader,
        { value: "Comentario" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_ventas_articulos?.map((v) => ({
        value: [
            { value: v.habitacion, className: "reports-cell" },
            { value: v.tipo_habitacion, className: "reports-cell" },
            { value: formatLowdashString(v.estatus_habitacion, true), className: "reports-cell" },
            { value: v.fecha, className: "reports-cell" },
            { value: v.usuario_actualiza, className: "reports-cell" },
            { value: v.comentario_status, className: "reports-cell" },
        ],
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport title={"No. de ocupaciones"} value={data?.dashboard?.ocupada || 0} />
                    <CardReport title={"No. de reservas"} value={data?.dashboard?.a_la_venta || 0} />
                    <CardReport title={"No. de limpiezas"} value={data?.dashboard?.a_la_venta || 0} />
                    <CardReport title={"No. de mantenimientos"} value={data?.dashboard?.mantenimiento || 0} />
                    <CardReport title={"No. de bloqueos"} value={data?.dashboard?.bloqueada || 0} />
                </CardReports>
            )}
            <TablePaginatorWrapper
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta?.total_paginas || 0}
                className="historial-habitaciones__table__wrapper"
                style={{
                    justifyContent: data?.respuesta.tabla_ventas_articulos?.length ? "flex-start" : "center",
                    borderRadius: "0 0 20px 0",
                }}
            >
                <TableWrappper isThisComponentInsideAPaginatorWrapper={!!data?.respuesta.tabla_ventas_articulos.length}>
                    <FlexibleTable
                        emptyState={{
                            headerIcon: "PieChartFilled",
                            titile: "Aún no hay reportes disponibles",
                            subTitle:
                                "Todavía no hay datos para mostrar en esta sección. Una vez que se genere un reporte, lo verás aquí.",
                        }}
                        onSort={setsortValue}
                        onSelectedFilters={setfilterValues}
                        containterClassName="historial-habitaciones__table"
                        tableItems={{
                            headers,
                            rows: load ? skeletonRows : tableItems,
                        }}
                    />
                </TableWrappper>
                <FloatButon
                    icon="Download"
                    onAdd={() => {
                        if (!apiDateFilter?.length) {
                            return
                        }
                        download({
                            endpoint: "/reportes/tabla_historial_habitaciones",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
                            },
                            title: "historial_habitaciones",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default Habitaciones
