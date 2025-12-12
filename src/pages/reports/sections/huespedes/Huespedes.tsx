import React, { useEffect, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { Huespedes as HuespedesType, TablaVentasArticulo } from "./Huespedes.type"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./Huespedes.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import "../../Reports.css"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import { Stringify } from "src/shared/types/Stringify"
import useTipoEntradaHeader from "./hooks/useTipoEntradaHeader"
import useFormattedMeta from "../hooks/useFormattedMeta"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport, { CardReportDouble } from "../../components/card-report/CardReport"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import { sum } from "src/shared/helpers/calculator"
import useEasyRewardsHeader from "./hooks/useEasyRewardsHeader"
import useMatriculasHeader from "./hooks/useMatriculaHeader"
import useMarcasHeader from "./hooks/useMarcasHeader"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import reportSelectedHandler from "../../helpers/reportSelectedHandler"
import { ReportsOptions } from "../../Reports.type"
import { formatText } from "src/shared/hooks/formatTextOpcions"

const Huespedes = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const formatHardcodedList = (list: string[] = []) => {
        return Array.from(new Set(list.filter((v) => v !== "-")))
    }

    const { data, refetch, load } = useFetch<HuespedesType>("/reportes/tabla_historial_huespedes", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)

    const tipoEntradaHeader = useTipoEntradaHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "tipo_entrada",
        valueToDisplay: "Entrada",
    })

    const easyRewardsHeader = useEasyRewardsHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "easyrewards",
        valueToDisplay: "Easyrewards",
        easyRewards: formatHardcodedList(data?.respuesta.tabla_ventas_articulos?.map((t) => t.easyrewards)),
    })

    const marcasHeader = useMarcasHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "marca_vehiculo",
        valueToDisplay: "Marca",
        modelos: formatHardcodedList(data?.respuesta.tabla_ventas_articulos?.map((t) => t.marca_vehiculo)),
    })

    const matriculaHeader = useMatriculasHeader<Stringify<TablaVentasArticulo>>({
        headerValue: "matricula_vehiculo",
        valueToDisplay: "Matrícula",
        matriculas: formatHardcodedList(data?.respuesta.tabla_ventas_articulos?.map((t) => t.matricula_vehiculo)),
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
            headerValues: ["tipo_entrada", "matricula_vehiculo", "marca_vehiculo", "easyrewards"],
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
        tipoEntradaHeader,
        matriculaHeader,
        marcasHeader,
        { value: "Modelo" },
        { value: "Color" },
        easyRewardsHeader,
        { value: "Correo cliente" },
        { value: "Teléfono cliente" },
        { value: "Total renta" },
        { value: "Total reserva" },
        { value: "Total extras" },
        { value: "Total restaurante" },
        { value: "Total room service" },
        { value: "Total" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] =
        data?.respuesta.tabla_ventas_articulos?.map((hab, index) => ({
            value: [
                { value: formatText(hab.tipo_entrada), className: "reports-cell" },
                { value: hab.matricula_vehiculo, className: "reports-cell" },
                { value: hab.marca_vehiculo, className: "reports-cell" },
                { value: hab.modelo_vehiculo, className: "reports-cell" },
                { value: hab.color_vehiculo, className: "reports-cell" },
                { value: hab.easyrewards, className: "reports-cell" },
                { value: hab.correo_cliente, className: "reports-cell" },
                { value: hab.telefono_cliente, className: "reports-cell" },
                { value: formatCurrencyToFixed(hab.consumo_renta), className: "reports-cell" },
                { value: formatCurrencyToFixed(hab.consumo_reserva), className: "reports-cell" },
                { value: formatCurrencyToFixed(hab.consumo_extras), className: "reports-cell" },
                { value: formatCurrencyToFixed(hab.consumo_restaurante), className: "reports-cell" },
                { value: formatCurrencyToFixed(hab.consumo_room_service), className: "reports-cell" },
                {
                    value: formatCurrencyToFixed(sum([
                        hab.consumo_renta,
                        hab.consumo_reserva,
                        hab.consumo_extras,
                        hab.consumo_restaurante,
                        hab.consumo_room_service,
                    ])),
                    className: "reports-cell",
                },
            ],
            key: index + "",
        })) || []

    const { setSelectedSection } = reportSelectedHandler()

    useEffect(() => {
        setSelectedSection(ReportsOptions.huespedes)
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
                    <CardReport title="No. de registros" value={data?.dashboard?.total_reg || "0"} />
                    <CardReportDouble
                        title1="Visitas por renta"
                        value1={
                            formatCurrencyToFixed(data?.dashboard?.venta_rentas || 0)
                        }
                        title2={"Visitas por reserva"}
                        value2={
                            formatCurrencyToFixed(data?.dashboard?.venta_reservas || 0)
                        }
                    />
                    <CardReport title="Ingresos por room service" value={formatCurrencyToFixed(data?.dashboard?.venta_rs || 0)} />
                    <CardReport title="Ingresos por extras" value={formatCurrencyToFixed(data?.dashboard?.venta_extras || 0)} />
                    <CardReport title="Ingresos por restaurante" value={formatCurrencyToFixed(data?.dashboard?.venta_rest || 0)} />
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
                            endpoint: "/reportes/tabla_historial_huespedes",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {})
                            },
                            title: "huespedes",
                        })
                    }}
                />
            </TablePaginatorWrapper>
        </ReportWrapper>
    )
}

export default Huespedes
