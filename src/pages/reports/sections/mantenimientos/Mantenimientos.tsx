import React, { useEffect, useMemo, useState } from "react"
import "../../Reports.css"
import "./Mantenimientos.css"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFetch } from "src/shared/hooks/useFetch"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import { Mantenimientos, TablaMantto } from "./Mantenimientos.type"
import useTurnoHeader from "../hooks/useTurnoHeader"
import { Stringify } from "src/shared/types/Stringify"
import useHabitacionesHeader from "../hooks/useHabitacionesHeader"
import useTipoHabitacionesHeader from "../hooks/useTipoHabitacionHeader"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import useFormattedMeta from "../hooks/useFormattedMeta"
import useColaboradoresHeader from "../hooks/useColaboradoresHeader"
import usePuestosHeader from "../hooks/usePuestosHeader"
import useTipoMttoHeader from "./hooks/useTipoMtto"

const HistorialMantenimientos = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const { data, refetch, load } = useFetch<Mantenimientos>("/reportes/tabla_historial_mantto", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)

    const turnoHeader = useTurnoHeader<Stringify<TablaMantto>>({
        headerValue: "turno",
        valueToDisplay: "Turno",
    })

    const habitacionHeader = useHabitacionesHeader<Stringify<TablaMantto>>({
        headerValue: "numero_habitacion",
        valueToDisplay: "Habitación",
    })

    const tipoHabitacionHeader = useTipoHabitacionesHeader<Stringify<TablaMantto>>({
        headerValue: "tipo_habitacion",
        valueToDisplay: "Tipo de habitación",
    })

    const responsableHeader = useColaboradoresHeader<Stringify<TablaMantto>>({
        headerValue: "responsable",
        valueToDisplay: "Responsable",
    })

    const tipoMttoHeader = useTipoMttoHeader<Stringify<TablaMantto>>({
        headerValue: "tipo_mantto",
        valueToDisplay: "Tipo",
    })

    const puestosHeader = usePuestosHeader<Stringify<TablaMantto>>({
        headerValue: "puesto",
        valueToDisplay: "Puesto",
    })

    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaMantto>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: [
                "numero_habitacion",
                "tipo_habitacion",
                "turno",
                "responsable",
                "puesto",
                "fecha_inicio",
                "fecha_termino",
                "tiempo_total",
            ],
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
        turnoHeader,
        tipoHabitacionHeader,
        habitacionHeader,
        tipoMttoHeader,
        responsableHeader,
        puestosHeader,
        { value: "fecha_inicio", valueToDisplay: "Inicio", sort: true },
        { value: "fecha_termino", valueToDisplay: "Cierre", sort: true },
        { value: "tiempo_total", valueToDisplay: "Duración", sort: true },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_manttos?.map((hab) => ({
        value: [
            { value: hab.turno, className: "reports-cell" },
            { value: hab.tipo_habitacion, className: "reports-cell" },
            { value: hab.numero_habitacion, className: "reports-cell" },
            { value: hab.tipo_mantto, className: "reports-cell" },
            { value: hab.responsable, className: "reports-cell" },
            { value: hab.puesto, className: "reports-cell" },
            { value: hab.fecha_inicio, className: "reports-cell" },
            { value: hab.fecha_termino, className: "reports-cell" },
            { value: hab.tiempo_total, className: "reports-cell" },
        ],
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport title="Tiempo promedio de mantenimiento" value={data.dashboard.total_manttos || "0"} />
                    <CardReport
                        title="Total de mantenimientos abiertos"
                        value={data.dashboard.total_manttos_abiertos || "0"}
                    />
                    <CardReport
                        title="Total de mantenimientos cerrados"
                        value={data.dashboard.total_manttos_cerrados || "0"}
                    />
                </CardReports>
            )}
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                style={{
                    justifyContent: data?.respuesta?.tabla_manttos?.length ? "flex-start" : "center",
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
                            endpoint: "/reportes/tabla_historial_mantto",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                            },
                            title: "propinas",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default HistorialMantenimientos
