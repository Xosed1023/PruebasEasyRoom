import React, { useEffect, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { ProductividadCamaristas as ProductividadCamaristasType, TablaLimpieza } from "./ProductividadCamaristas.type"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./ProductividadCamaristas.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import "../../Reports.css"
import { Stringify } from "src/shared/types/Stringify"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import useTipoHabitacionesHeader from "../hooks/useTipoHabitacionHeader"
import useTipoLimpiezaHeader from "./hooks/useTipoLimpiezaHeader"
import useHabitacionesHeader from "../hooks/useHabitacionesHeader"
import useColaboradoresHeader from "../hooks/useColaboradoresHeader"
import useFormattedMeta from "../hooks/useFormattedMeta"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import reportSelectedHandler from "../../helpers/reportSelectedHandler"
import { ReportsOptions } from "../../Reports.type"
import { capitalize } from "src/shared/helpers/capitalize"
import formatTime from "./helpers/formatTime"

const ProductividadCamaristas = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const { data, refetch, load } = useFetch<ProductividadCamaristasType>("/reportes/tabla_productividad_camaristas", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)

    const habitacionHeader = useHabitacionesHeader<Stringify<TablaLimpieza>>({
        headerValue: "habitacion",
        valueToDisplay: "Habitación",
    })

    const tipoLimpiezaHeader = useTipoLimpiezaHeader<Stringify<TablaLimpieza>>({
        headerValue: "tipo_limpieza",
        valueToDisplay: "Tipo de limpieza",
    })

    const tipoHabitacionHeader = useTipoHabitacionesHeader<Stringify<TablaLimpieza>>({
        headerValue: "tipo_habitacion",
        valueToDisplay: "Tipo de habitación",
    })

    const camaristaHeader = useColaboradoresHeader<Stringify<TablaLimpieza>>({
        headerValue: "camarista",
        valueToDisplay: "Camarista",
    })

    const supervisorHeader = useColaboradoresHeader<Stringify<TablaLimpieza>>({
        headerValue: "supervisor",
        valueToDisplay: "Supervisor",
    })

    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaLimpieza>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: [
                "tipo_habitacion",
                "habitacion",
                "tipo_limpieza",
                "camarista",
                "inicio_limpieza",
                "fin_limpieza",
                "supervisor",
                "Inicio supervision",
                "fin_supervision",
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
        tipoHabitacionHeader,
        habitacionHeader,
        tipoLimpiezaHeader,
        camaristaHeader,
        { value: "inicio_limpieza", valueToDisplay: "Inicio de limpieza", sort: true },
        { value: "fin_limpieza", valueToDisplay: "Fin de limpieza", sort: true },
        supervisorHeader,
        { value: "Inicio supervision", valueToDisplay: "Inicio de supervisión", sort: true },
        { value: "fin_supervision", valueToDisplay: "Fin de supervisión", sort: true },
        { value: "Comentarios" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_limpiezas?.map((hab) => ({
        value: [
            { value: hab.tipo_habitacion, className: "reports-cell" },
            { value: hab.habitacion, className: "reports-cell" },
            { value: capitalize(hab.tipo_limpieza), className: "reports-cell" },
            { value: hab.camarista, className: "reports-cell" },
            { value: hab.inicio_limpieza, className: "reports-cell" },
            { value: hab.fin_limpieza, className: "reports-cell" },
            { value: hab.supervisor, className: "reports-cell" },
            { value: hab["Inicio supervision"], className: "reports-cell" },
            { value: hab.fin_supervision, className: "reports-cell" },
            { value: hab.observaciones, className: "reports-cell" },
        ],
    }))

    const { setSelectedSection } = reportSelectedHandler()

    useEffect(() => {
        setSelectedSection(ReportsOptions.limpSup)
    }, [])

    useEffect(() => {
        setcurrentPage(1)
    }, [apiDateFilter])

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport title="No. de limpiezas" value={data.dashboard.total_limpiezas || "0"} />
                    <CardReport
                        title="Promedio de limpieza"
                        value={formatTime(data.dashboard.promedio_limpieza || 0)}
                    />
                    <CardReport title="No. de supervisores" value={data.dashboard.total_supervisiones || "0"} />
                    <CardReport
                        title="Promedio de supervisión"
                        value={formatTime(data.dashboard.promedio_supervision || 0)}
                    />
                </CardReports>
            )}
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                style={{
                    justifyContent: data?.respuesta?.tabla_limpiezas?.length ? "flex-start" : "center",
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
                        onSelectedFilters={(v) => {
                            setcurrentPage(1)
                            setfilterValues(v)
                        }}
                        onSort={(v) => {
                            setcurrentPage(1)
                            setsortValue(v)
                        }}
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
                            endpoint: "/reportes/tabla_productividad_camaristas",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {})
                            },
                            title: "productividad_camaristas",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default ProductividadCamaristas
