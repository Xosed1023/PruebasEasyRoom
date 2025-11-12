import { useEffect, useState } from "react"
import "../../Reports.css"
import "./Matriculas.css"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFetch } from "src/shared/hooks/useFetch"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import FlexibleTable, {
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"

const Matriculas = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()

    const { data, refetch, load } = useFetch<{todo: string[]}>("/reportes/tabla_historial_mantto", {
        startFetch: false,
    })

    const [currentPage, setcurrentPage] = useState(1)

    useEffect(() => {
        if (apiDateFilter) {
            refetch({
                hotel_id,
                fecha_inicio: apiDateFilter[0],
                fecha_fin: apiDateFilter[1],
                take: 15,
                page: currentPage,
            })
        }
    }, [apiDateFilter, currentPage])

    const headers: FlexibleTableHeaderColumn[] = [
        { value: "No. Corte" },
        { value: "Matrícula" },
        { value: "Fecha y hora de entrada" },
        { value: "Color" },
        { value: "Marca" },
        { value: "Modelo" },
        { value: "Concepto de entrada" },
        { value: "Acciones" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.todo?.map((hab) => ({
        value: [
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
            { value: "Todo", className: "reports-cell" },
        ],
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={1}
                style={{
                    justifyContent: data?.todo?.length ? "flex-start" : "center",
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

export default Matriculas
