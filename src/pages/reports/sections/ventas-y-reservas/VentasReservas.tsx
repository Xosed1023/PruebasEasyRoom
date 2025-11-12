import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import { CardReportResume } from "../../components/card-report/CardReport"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import useFormattedMeta from "../hooks/useFormattedMeta"
import { useEffect, useMemo, useState } from "react"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import { Stringify } from "src/shared/types/Stringify"
import { HistorialVentasYReservas, TablaVentasReserva } from "./VentasYReservas.type"
import useOrigenHeader from "./hooks/useOrigenHeader"
import useHabitacionesHeader from "../hooks/useHabitacionesHeader"
import useTipoHabitacionesHeader from "../hooks/useTipoHabitacionHeader"

const VentasReservas = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const { data, refetch, load } = useFetch<HistorialVentasYReservas>("/reportes/tabla_estancia_reservas", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)

    const origenHeader = useOrigenHeader<Stringify<TablaVentasReserva>>({
        headerValue: "origen",
        valueToDisplay: "Origen",
    })

    const habitacionHeader = useHabitacionesHeader<Stringify<TablaVentasReserva>>({
        headerValue: "numero_habitacion",
        valueToDisplay: "Habitación",
    })

    const tipoHabitacionHeader = useTipoHabitacionesHeader<Stringify<TablaVentasReserva>>({
        headerValue: "tipo_habitacion",
        valueToDisplay: "Tipo de habitación",
    })

    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaVentasReserva>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: ["numero_habitacion", "tipo_habitacion", "fecha_registro", "origen"],
        }),
        [filterValues, sortValue]
    )

    const { formattedMeta } = useFormattedMeta(formattedMetaValues)

    useEffect(() => {
        if (apiDateFilter) {
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

    const headers: FlexibleTableHeaderColumn[] = [
        origenHeader,
        { value: "Movimiento" },
        habitacionHeader,
        tipoHabitacionHeader,
        { value: "fecha_registro", valueToDisplay: "Fecha" },
        { value: "Cantidad" },
        { value: "Precio" },
        // TODO: Total
        // {value: "Total"}
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_ventas_reservas?.map((hab) => ({
        value: [
            { value: hab.origen, className: "reports-cell" },
            { value: hab.movimiento, className: "reports-cell" },
            { value: hab.numero_habitacion, className: "reports-cell" },
            { value: hab.tipo_habitacion, className: "reports-cell" },
            { value: hab.fecha_registro, className: "reports-cell" },
            { value: hab.Cantidad, className: "reports-cell" },
            { value: hab.precio, className: "reports-cell" },
            // { value: hab., className: "reports-cell" },
        ],
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReportResume
                        title1="Venta de habitaciones"
                        value1={formatCurrency(Number(data?.dashboard?.venta_habitaciones || 0))}
                        title2="Total"
                        value2={data.dashboard.cantidad_habitaciones}
                    />
                    <CardReportResume
                        title1="Venta reservas"
                        value1={formatCurrency(Number(data?.dashboard?.venta_reservas || 0))}
                        title2="Total"
                        value2={data.dashboard.cantidad_reservas}
                    />
                    <CardReportResume
                        title1="Venta renovaciones"
                        value1={formatCurrency(Number(data?.dashboard?.venta_hospedaje_extra || 0))}
                        title2="Total"
                        value2={data.dashboard.cantidad_hospedaje_extra}
                    />
                    <CardReportResume
                        title1="Venta horas extra"
                        value1={formatCurrency(Number(data?.dashboard?.venta_horas_extras || 0))}
                        title2="Total"
                        value2={data.dashboard.cantidad_horas_extras}
                    />
                    <CardReportResume
                        title1="Venta personas extra"
                        value1={formatCurrency(Number(data?.dashboard?.venta_personas_extra || 0))}
                        title2="Total"
                        value2={data.dashboard.cantidad_personas_extra}
                    />
                </CardReports>
            )}
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                style={{
                    justifyContent: data?.respuesta?.tabla_ventas_reservas?.length ? "flex-start" : "center",
                    borderRadius: "0 0 20px 0",
                }}
            >
                <TableWrappper>
                    <FlexibleTable
                        emptyState={{
                            headerIcon: "PieChartFilled",
                            titile: "Aún no hay reportes disponibles",
                            subTitle:
                                "Todavía no hay datos para mostrar en esta sección. Una vez que se genere un reporte, lo verás aquí.",
                        }}
                        onSelectedFilters={setfilterValues}
                        onSort={setsortValue}
                        containterClassName="historial-propinas__table"
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
                            endpoint: "/reportes/tabla_estancia_reservas",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                            },
                            title: "ventas_reservas",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default VentasReservas
