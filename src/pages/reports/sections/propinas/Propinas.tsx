import React, { useEffect, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./Propinas.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import "../../Reports.css"
import { PropinasItems, TablaPropinasPagada } from "./Propinas.type"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import CardReports from "../../components/card-reports/CardReports"
import CardReport, { CardReportDouble } from "../../components/card-report/CardReport"
import useColaboradoresHeader from "../hooks/useColaboradoresHeader"
import { Stringify } from "src/shared/types/Stringify"
import useAreasHeader from "../hooks/useAreaHeader"
import usePuestosHeader from "../hooks/usePuestosHeader"
import useFormattedMeta from "../hooks/useFormattedMeta"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"

const Propinas = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const { data, refetch, load } = useFetch<PropinasItems>("/reportes/tabla_historial_propinas", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)

    const colaboradorHeader = useColaboradoresHeader<Stringify<TablaPropinasPagada>>({
        headerValue: "colaborador",
        valueToDisplay: "Personal",
    })
    const areasHeader = useAreasHeader<Stringify<TablaPropinasPagada>>({ headerValue: "area", valueToDisplay: "Área" })
    const puestosHeader = usePuestosHeader<Stringify<TablaPropinasPagada>>({
        headerValue: "puesto",
        valueToDisplay: "Puesto",
    })

    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaPropinasPagada>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: ["colaborador", "area", "puesto"],
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
        { value: "fecha_registro", valueToDisplay: "Fecha de pago" },
        colaboradorHeader,
        areasHeader,
        puestosHeader,
        { value: "Puntos a pagar" },
        { value: "Utilidad por puntos" },
        { value: "Comisión bancaria" },
        { value: "Total pagado" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_propinas_pagadas?.map((hab) => ({
        value: [
            { value: hab.fecha_registro, className: "reports-cell" },
            { value: hab.colaborador, className: "reports-cell" },
            { value: hab.area, className: "reports-cell" },
            { value: hab.puesto, className: "reports-cell" },
            { value: hab.puntos_a_pagar, className: "reports-cell" },
            { value: hab.utilidad_por_puntos, className: "reports-cell" },
            { value: hab.comision_bancaria, className: "reports-cell" },
            { value: hab.pago_a_colaborador, className: "reports-cell" },
        ],
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport
                        title={"Propinas pagadas"}
                        value={formatCurrency(Number(data?.dashboard?.total_propinas_pagadas || 0))}
                    />
                    <CardReport title={"No. de pagos"} value={data?.dashboard?.contador_propinas_pagadas || 0} />
                    <CardReport
                        title={"Promedio de propinas"}
                        value={data?.dashboard?.promedio_propinas_pagadas || 0}
                    />
                    <CardReportDouble
                        title1={"Utilidad por puntos"}
                        value1={data?.dashboard?.total_utilidad_por_puntos || 0}
                        title2={"Puntos a pagar"}
                        value2={data?.dashboard?.total_puntios_a_pagar || 0}
                    />
                    <CardReport title={"Comisión bancaria"} value={data?.dashboard?.total_comisiones_bancarias || 0} />
                </CardReports>
            )}
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                style={{
                    justifyContent: data?.respuesta?.tabla_propinas_pagadas?.length ? "flex-start" : "center",
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
                            endpoint: "/reportes/tabla_historial_propinas",
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

export default Propinas
