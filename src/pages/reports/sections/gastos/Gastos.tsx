import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import useCategoriaGastoHeader from "./hooks/useCategoriaHeader"
import useSubCategoriaGastoHeader from "./hooks/useSubcategoriaGastosHeader"
import useMetodoPagoHeader from "./hooks/useMetodoPagoHeader"
import useIsCajaChicaHeader from "./hooks/useIsCajaChicaHeader"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import { useFetch } from "src/shared/hooks/useFetch"
import { useEffect, useMemo, useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"
import useFormattedMeta from "../hooks/useFormattedMeta"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import { GastosItems, TablaGasto } from "./Gastos.type"
import { Stringify } from "src/shared/types/Stringify"
import useColaboradoresHeader from "../hooks/useColaboradoresHeader"

const CATEGORIA_HEADER_VALUE = "Categoría"
const SUB_CATEGORIA_HEADER_VALUE = "Sub categoría"
const METODO_PAGO_HEADER_VALUE = "Método de pago"
const CAJA_CHICA_HEADER_VALUE = "Caja chica"
const RESPONSABLE_HEADER_VALUE = "Responsable"

const Gastos = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const [currentPage, setcurrentPage] = useState(1)
    const { download } = useDownloadPdf()

    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const { data, refetch, load } = useFetch<GastosItems>("/reportes/tabla_gastos", {
        startFetch: false,
    })

    const categoriaValues = useMemo(() => filterValues?.filter(f => f.fromHeader === "categoria_id").map(f => f.filter), [filterValues])

    const categoriasHeader = useCategoriaGastoHeader<Stringify<TablaGasto>>({
        headerValue: "categoria_id",
        valueToDisplay: CATEGORIA_HEADER_VALUE,
    })
    const subcategoriasGastoHeader = useSubCategoriaGastoHeader<Stringify<TablaGasto>>({
        headerValue: "Subcategoria",
        valueToDisplay: SUB_CATEGORIA_HEADER_VALUE,
        categoria_id: categoriaValues
    })
    const metodosPagosHeader = useMetodoPagoHeader<Stringify<TablaGasto>>({
        headerValue: "metodo_pago",
        valueToDisplay: METODO_PAGO_HEADER_VALUE,
    })
    const isCajaChicaHeader = useIsCajaChicaHeader<Stringify<TablaGasto>>({
        headerValue: "caja_chica",
        valueToDisplay: CAJA_CHICA_HEADER_VALUE,
    })
    const responsableHeader = useColaboradoresHeader<Stringify<TablaGasto>>({
        headerValue: "Responsable",
        valueToDisplay: RESPONSABLE_HEADER_VALUE,
    })

    const headers: FlexibleTableHeaderColumn[] = [
        { value: "#" },
        categoriasHeader,
        subcategoriasGastoHeader,
        { value: "Descripción del gasto" },
        { value: "Monto" },
        metodosPagosHeader,
        isCajaChicaHeader,
        responsableHeader,
        { value: "Fecha_gasto", valueToDisplay: "Fecha de gasto", sort: true },
        { value: "Total" },
    ]

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaGasto>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: ["categoria_id", "Subcategoria", "metodo_pago", "Responsable", "caja_chica", "Fecha_gasto"],
        }),
        [filterValues, sortValue]
    )

    const { formattedMeta } = useFormattedMeta(formattedMetaValues)
    const { skeletonRows } = tableSkeletonRows({ headers })

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

    const tableItems: FlexibleTableRow[] = data?.respuesta?.tabla_gastos?.map((g) => ({
        value: [
            { value: g.Folio, className: "reports-cell" },
            { value: g.Categoria, className: "reports-cell" },
            { value: g.Subcategoria, className: "reports-cell" },
            { value: g.Descripcion, className: "reports-cell" },
            { value: g.monto, className: "reports-cell" },
            { value: g.metodo_pago, className: "reports-cell" },
            { value: g.caja_chica, className: "reports-cell" },
            { value: g.Responsable, className: "reports-cell" },
            { value: g.Fecha_registro, className: "reports-cell" },
            { value: g.Fecha_gasto, className: "reports-cell" },
        ],
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport
                        title={"Gastos administrativos"}
                        value={formatCurrencyToFixed(Number(data?.dashboard?.administrativos_total))}
                    />
                    <CardReport
                        title={"Gastos financieros"}
                        value={formatCurrencyToFixed(Number(data?.dashboard?.financieros_total))}
                    />
                    <CardReport
                        title={"Gastos operativos"}
                        value={formatCurrencyToFixed(Number(data?.dashboard?.operativos_total))}
                    />
                    <CardReport
                        title={"Propinas"}
                        value={formatCurrencyToFixed(Number(data?.dashboard?.propinas_total))}
                    />
                    <CardReport title={"Otros"} value={formatCurrencyToFixed(Number(data?.dashboard?.otros_total))} />
                </CardReports>
            )}
            <TablePaginatorWrapper
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                className="articulos-vendidos__table__wrapper"
                style={{
                    justifyContent: data?.respuesta?.tabla_gastos?.length ? "flex-start" : "center",
                    borderRadius: "0 0 20px 0",
                }}
            >
                <TableWrappper isThisComponentInsideAPaginatorWrapper={!!data?.respuesta?.tabla_gastos?.length}>
                    <FlexibleTable
                        onSelectedFilters={setfilterValues}
                        onSort={setsortValue}
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
                            endpoint: "/reportes/tabla_gastos",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
                            },
                            title: "gastos",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default Gastos
