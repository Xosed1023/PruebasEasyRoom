import { useEffect, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { HistorialVentasArticulos, TablaVentasArticulo } from "./ArticulosVendidos.type"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./ArticulosVendidos.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import "../../Reports.css"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import useArticuloHeader from "../hooks/useArticuloHeader"
import useOrigenHeader from "../hooks/useOrigenHeader"
import useReferenciaHeader from "../hooks/useReferenciaHeadet"
import useCategoriasArticulosHeader from "../hooks/useCategoriasArticulosHeader"
import useTurnoHeader from "../hooks/useTurnoHeader"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import useFormattedMeta from "../hooks/useFormattedMeta"
import { Stringify } from "src/shared/types/Stringify"
import reportSelectedHandler from "../../helpers/reportSelectedHandler"
import { ReportsOptions } from "../../Reports.type"

const ARTICULO_HEADER_VALUE = "Articulo"
const REFERENCIA_HEADER_VALUE = "Referencia"
const ORIGEN_HEADER_VALUE = "Origen"
const CATEGORIA_HEADER_VALUE = "Categoría"
const TURNO_HEADER_VALUE = "Turno"

const FECHA_HEADER_VALUE = "Fecha"
const TICKET_HEADER_VALUE = "Ticket"

const ArticulosVendidos = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()

    const { data, refetch, load } = useFetch<HistorialVentasArticulos>("/reportes/tabla_venta_articulos", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)
    const { download } = useDownloadPdf()
    const articuloHeader = useArticuloHeader<Stringify<TablaVentasArticulo>>({
        headerValue: ARTICULO_HEADER_VALUE,
        valueToDisplay: "Artículo",
    })
    const referenciaHeader = useReferenciaHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "Referencia",
        valueToDisplay: REFERENCIA_HEADER_VALUE,
    })
    const origenHeader = useOrigenHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "Origen",
        valueToDisplay: ORIGEN_HEADER_VALUE,
    })
    const categoriasArticulosHeader = useCategoriasArticulosHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "Categoria",
        valueToDisplay: CATEGORIA_HEADER_VALUE,
    })
    const turnosHeader = useTurnoHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "Turno",
        valueToDisplay: TURNO_HEADER_VALUE,
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
            headerValues: ["Articulo", "Referencia", "Origen", "Categoria", "Turno", "Fecha", "Ticket"],
        }),
        [filterValues, sortValue]
    )

    const { formattedMeta } = useFormattedMeta(formattedMetaValues)

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

    const headers: FlexibleTableHeaderColumn[] = [
        {
            value: TICKET_HEADER_VALUE,
            sort: true,
        },
        { value: FECHA_HEADER_VALUE, sort: true },
        origenHeader,
        referenciaHeader,
        articuloHeader,
        categoriasArticulosHeader,
        { value: "Precio" },
        { value: "Cantidad" },
        { value: "Total" },
        turnosHeader,
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_ventas_articulos?.map((v, index) => ({
        value: [
            { value: v.Ticket, className: "reports-cell" },
            { value: v.Fecha, className: "reports-cell" },
            { value: v.Origen, className: "reports-cell", fromHeaderFilter: ORIGEN_HEADER_VALUE },
            { value: v.Referencia, className: "reports-cell", fromHeaderFilter: REFERENCIA_HEADER_VALUE },
            { value: v.Articulo, className: "reports-cell", fromHeaderFilter: ARTICULO_HEADER_VALUE },
            { value: v.Categoria, className: "reports-cell", fromHeaderFilter: CATEGORIA_HEADER_VALUE },
            { value: formatCurrencyToFixed(Number(v.Precio)), className: "reports-cell" },
            { value: v.Cantidad, className: "reports-cell" },
            { value: formatCurrencyToFixed(Number(v.Total)), className: "reports-cell" },
            { value: v.Turno, className: "reports-cell", fromHeaderFilter: TURNO_HEADER_VALUE },
        ],
        key: `row-${index}`,
    }))

    const { setSelectedSection } = reportSelectedHandler()
    
    useEffect(() => {
        setSelectedSection(ReportsOptions.artVendidos)
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
                    <CardReport title={"Total de venta"} value={formatCurrencyToFixed(data?.dashboard?.total_ventas || 0)} />
                    <CardReport title={"Total de artículos"} value={data?.dashboard?.cantidad_articulos} />
                    <CardReport title={"SKUs"} value={data?.dashboard?.contador_sku || 0} />
                    <CardReport
                        title={"Ticket promedio"}
                        value={formatCurrencyToFixed(Number(data?.dashboard?.ticket_promedio))}
                    />
                </CardReports>
            )}
            <TablePaginatorWrapper
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                className="articulos-vendidos__table__wrapper"
                style={{
                    justifyContent: data?.respuesta?.tabla_ventas_articulos?.length ? "flex-start" : "center",
                    borderRadius: "0 0 20px 0",
                }}
            >
                <TableWrappper isThisComponentInsideAPaginatorWrapper={!!data?.respuesta.tabla_ventas_articulos.length}>
                    <FlexibleTable
                        onSelectedFilters={(v) => {
                            setcurrentPage(1)
                            setfilterValues(v)
                        }}
                        onSort={(v) => {
                            setcurrentPage(1)
                            setsortValue(v)
                        }}
                        emptyState={{
                            headerIcon: "PieChartFilled",
                            titile: "Aún no hay reportes disponibles",
                            subTitle:
                                "Todavía no hay datos para mostrar en esta sección. Una vez que se genere un reporte, lo verás aquí.",
                        }}
                        containterClassName="articulos-vendidos__table"
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
                            endpoint: "/reportes/tabla_venta_articulos",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                                page: currentPage,
                                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
                            },
                            title: "articulos_vendidos",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default ArticulosVendidos
