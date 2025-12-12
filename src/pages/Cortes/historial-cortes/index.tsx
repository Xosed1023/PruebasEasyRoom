import { useMemo } from "react"
import { useCurrentDateQuery } from "src/gql/schema"
import Screen from "src/shared/components/layout/screen/Screen"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { useHeader, useRows } from "../caratulas/fecha/hooks/useTable"
import Icon from "src/shared/icons"
import corteDiaOpener from "src/shared/openers/corteDiaOpener"
import { useFetchCortesHistorial } from "../caratulas/fecha/hooks/useFetch"
import { getDaySearch } from "../caratulas/fecha/hooks/useParams"
import "./../CortesScreen.css"
import "./HistorialCortes.css"

function HistorialCortesSemanal(): JSX.Element {
    const { data: currentDate } = useCurrentDateQuery()

    const variables = useMemo(
        () => {
            const date = currentDate?.serverDate ? new Date(currentDate.serverDate) : new Date()
            const fecha_fin = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            const fecha_inicio = new Date(fecha_fin)
            
            fecha_inicio.setDate(fecha_inicio.getDate() - 7)

            return {
                fecha_inicio_corte: null,
                fecha_corte: {
                    dia_inicial: getDaySearch(fecha_inicio.toISOString()),
                    dia_final: getDaySearch(fecha_fin.toISOString()),
                },
            }
        },
        [currentDate]
    )

    const { data, load, error } = useFetchCortesHistorial({
        variables,
        fetch: true,
        disabled:
            !currentDate?.serverDate ||
            !variables.fecha_corte.dia_inicial ||
            !variables.fecha_corte.dia_final,
    })

    const headers = useHeader(data || [])
    const { rows, handleFilter } = useRows(data || [])
    const { skeletonRows } = tableSkeletonRows({ headers })

    const showTable = (!data && !error) || (data?.length && !load)

    return (
        <Screen className="historial-cortes__screen" title={"Historial de cortes"} close={true}>
            <div className="historial-cortes__table">
                {showTable ? (
                    <FlexibleTable
                        onSelectedFilters={handleFilter}
                        tableItems={{
                            ...{
                                headers,
                                rows: !data?.length
                                    ? skeletonRows
                                    : rows.map((row) => ({
                                        value: row.value.map(({ value }, index) => ({
                                            value:
                                                index === headers.length - 1 ? (
                                                    <CellPrinter corteId={value} />
                                                ) : (
                                                    value
                                                ),
                                        })),
                                    })),
                            },
                        }}
                        emptyState={{
                            titile: "Sin resultados",
                            subTitle: "No hay resultados. Intenta de nuevo.",
                            headerIcon: "dollarCircle",
                        }}
                    ></FlexibleTable>
                ) : (
                    <Empty
                        className="historial-cortes__empty"
                        icon="dollarCircle"
                        title={"Sin cortes"}
                        description={"Aquí podrás ver el listado de cortes"}
                    />
                )}
            </div>
        </Screen>
    )
}

export default HistorialCortesSemanal

const CellPrinter = ({ corteId = "" }) => {
    return (
        <div
            className="historial-cortes__print"
            onClick={() =>
                corteDiaOpener({
                    stateCorteHistorial: {
                        corte_id: corteId,
                    },
                })
            }
        >
            <Icon name={"printer"} height={16} width={16} color={"var(--primary)"} />
        </div>
    )
}