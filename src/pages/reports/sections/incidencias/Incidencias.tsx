import React, { useEffect, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { HistorialIncidencias, TablaVentasArticulo } from "./Incidencias.type"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./Incidencias.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import "../../Reports.css"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import { Stringify } from "src/shared/types/Stringify"
import useFormattedMeta from "../hooks/useFormattedMeta"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import useStatusHeader from "./hooks/useStatusHeader"
import useLugarResHeader from "./hooks/useLugarResHeader"
import useTipoHeader from "./hooks/useTipoHeader"
import useUrgenciaHeader from "./hooks/useUrgenciaHeader"
import useHabitacionesHeader from "../hooks/useHabitacionesHeader"
import useMatriculasHeader from "./hooks/useMatriculaHeader"
import useUsuarioHeader from "../hooks/useUsuarioHeader"

const Incidencias = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const formatHardcodedList = (list: string[] = []) => {
        return Array.from(new Set(list.filter((v) => v !== "-")))
    }

    const { data, refetch, load } = useFetch<HistorialIncidencias>("/reportes/tabla_historial_incidencias", {
        startFetch: false,
    })

    const statusHeader = useStatusHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "estado_incidencia",
        valueToDisplay: "Estatus",
    })

    const lugarResHeader = useLugarResHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "lugar_responsable",
        valueToDisplay: "Lugar o responsable",
    })

    const tipoHeader = useTipoHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "tipo_incidencia",
        valueToDisplay: "Tipo",
    })

    const urgenciaHeader = useUrgenciaHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "urgencia",
        valueToDisplay: "Urgencia",
    })

    const habitacionHeader = useHabitacionesHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "numero_habitacion",
        valueToDisplay: "Habitación",
    })

    const matriculasHeader = useMatriculasHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "matricula",
        valueToDisplay: "Matrícula",
        matriculas: formatHardcodedList(data?.respuesta.tabla_ventas_articulos?.map((t) => t.matricula || "-")),
    })

    const usuarioReportaHeader = useUsuarioHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "reporta",
        valueToDisplay: "Reporta",
    })

    const cierraReportaHeader = useUsuarioHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "cierra",
        valueToDisplay: "Cierra",
    })

    const [currentPage, setcurrentPage] = useState(1)

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
            headerValues: [
                "fecha_registro",
                "fecha_cierre",
                "estado_incidencia",
                "lugar_responsable",
                "tipo_incidencia",
                "numero_habitacion",
                "matricula",
                "urgencia",
                "reporta",
                "cierra",
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
        { value: "Folio" },
        statusHeader,
        { value: "fecha_registro", valueToDisplay: "Fecha y hora", sort: true },
        lugarResHeader,
        tipoHeader,
        urgenciaHeader,
        habitacionHeader,
        matriculasHeader,
        { value: "Descripción" },
        usuarioReportaHeader,
        cierraReportaHeader,
        { value: "fecha_cierre", valueToDisplay: "Fecha y hora", sort: true },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_ventas_articulos?.map((incidencia, index) => ({
        value: [
            { value: incidencia.folio_incidencia || "-", className: "reports-cell" },
            { value: incidencia.estado_incidencia || "-", className: "reports-cell" },
            { value: incidencia.fecha_registro || "-", className: "reports-cell" },
            { value: incidencia.lugar_responsable || "-", className: "reports-cell" },
            { value: incidencia.tipo_incidencia || "-", className: "reports-cell" },
            { value: incidencia.urgencia || "-", className: "reports-cell" },
            { value: incidencia.numero_habitacion, className: "reports-cell" },
            { value: incidencia.matricula || "-", className: "reports-cell" },
            { value: incidencia.descripcion || "-", className: "reports-cell" },
            { value: incidencia.reporta || "-", className: "reports-cell" },
            { value: incidencia.cierra || "-", className: "reports-cell" },
            { value: incidencia.fecha_cierre || "-", className: "reports-cell" },
        ],
        key: index + "",
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport title="Total de incidencias" value={data.dashboard.total_incidencias + ""} />
                    <CardReport title="Limpieza" value={data.dashboard.total_limpieza + ""} />
                    <CardReport title="Mantenimiento" value={data.dashboard.total_mantto + ""} />
                    <CardReport title="Objetos olvidados" value={data.dashboard.total_objetos_olvidados + ""} />
                    <CardReport title="Incidencia alta" value={data.dashboard.urgencia_alta + ""} />
                    <CardReport title="Incidencia media" value={data.dashboard.urgencia_media + ""} />
                    <CardReport title="Incidencia baja" value={data.dashboard.urgencia_baja + ""} />
                </CardReports>
            )}
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                style={{
                    justifyContent: data?.respuesta?.tabla_ventas_articulos?.length ? "flex-start" : "center",
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
                            endpoint: "/reportes/tabla_historial_incidencias",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                            },
                            title: "incidencias",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default Incidencias
