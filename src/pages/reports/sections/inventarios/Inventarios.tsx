import React, { useEffect, useMemo, useState } from "react"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { Stringify } from "src/shared/types/Stringify"
import useFormattedMeta from "../hooks/useFormattedMeta"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import { InventariosType, TablaVentasArticulo } from "./Inventarios.type"
import useArticuloHeader from "../hooks/useArticuloHeader"
import useMarcasHeader from "./hooks/useMarcaHeader"
import useAlmacenHeader from "./hooks/useAlmacenHeader"
import useTipoMovimientoHeader from "./hooks/useTipoMovimientoHeader"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import formatLongNumber from "src/shared/helpers/formatLongNumber"
import reportSelectedHandler from "../../helpers/reportSelectedHandler"
import { ReportsOptions } from "../../Reports.type"

const Inventarios = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const formatHardcodedList = (list: string[] = []) => {
        return Array.from(new Set(list.filter((v) => v !== "-")))
    }

    const { data, refetch, load } = useFetch<InventariosType>("/reportes/tabla_historial_inventarios", {
        startFetch: false,
    })

    const articulosHeader = useArticuloHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "articulo",
        valueToDisplay: "Artículo",
    })

    const tipoMovimientoHeader = useTipoMovimientoHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "tipo",
        valueToDisplay: "Tipo",
    })

    const almacenHeader = useAlmacenHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "almacen",
        valueToDisplay: "Almacén",
        almacenes: formatHardcodedList(data?.respuesta.tabla_ventas_articulos?.map((t) => t.almacen))
    })

    const marcaHeader = useMarcasHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "marca",
        valueToDisplay: "Marca",
        marcas: formatHardcodedList(data?.respuesta.tabla_ventas_articulos?.map((t) => t.marca))
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
                "articulo",
                "tipo",
                "almacen",
                "marca",
                "fecha_movimiento"
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
        { value: "#" },
        { value: "fecha_movimiento", valueToDisplay: "Fecha de movimiento", sort: true },
        { value: "Cantidad" },
        articulosHeader,
        marcaHeader,
        { value: "Unidad" },
        almacenHeader,
        tipoMovimientoHeader,
        { value: "Costo" },
        { value: "Precio" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_ventas_articulos?.map((mov, index) => ({
        value: [
            { value: mov.numero_articulo, className: "reports-cell" },
            { value: mov.fecha_movimiento, className: "reports-cell" },
            { value: mov.cantidad_movimiento, className: "reports-cell" },
            { value: mov.articulo, className: "reports-cell" },
            { value: mov.marca, className: "reports-cell" },
            { value: mov.unidad, className: "reports-cell" },
            { value: mov.almacen, className: "reports-cell" },
            { value: mov.tipo, className: "reports-cell" },
            { value: formatCurrencyToFixed(mov.costo_compra), className: "reports-cell" },
            { value: formatCurrencyToFixed(mov.precio_venta), className: "reports-cell" },
        ],
        key: index + "",
    }))
    
    const { setSelectedSection } = reportSelectedHandler()
    
    useEffect(() => {
        setSelectedSection(ReportsOptions.existenciaInventario)
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
                    <CardReport title="Valor comercial" value={data.dashboard.valor_comercial ? formatCurrencyToFixed(data.dashboard.valor_comercial) : "$0"} />
                    <CardReport title="Costo total de inventario" value={data.dashboard.costo_inventario ? formatCurrencyToFixed(data.dashboard.costo_inventario) : "$0"} />
                    <CardReport title="Cantidad de artículos" value={data.dashboard.cantidad_articulos ? formatLongNumber(data.dashboard.cantidad_articulos) : "0"} />
                    <CardReport title="Artículos agotados" value={data.dashboard.cantidad_agotados ? formatLongNumber(data.dashboard.cantidad_agotados) : "0"} />
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
                            endpoint: "/reportes/tabla_historial_inventarios",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                            },
                            title: "inventarios",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default Inventarios
