import { useMemo, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Download from "src/shared/icons/Download"
import Empty from "src/shared/components/data-display/empty/Empty"
import corteDiaOpener from "src/shared/openers/corteDiaOpener"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { CellActions } from "./Fecha.sections"
import { useHeader, useRows } from "./hooks/useTable"
import { useDateParams } from "./hooks/useParams"
import { useFetchCortesHistorial } from "./hooks/useFetch"
import "./../../CortesScreen.css"
import "./Fecha.css"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function CaratulaFecha(): JSX.Element {
    const { fecha_inicial, fecha_final, fecha_corte_inicial, fecha_corte_final, ready, range } = useDateParams()
    const [showGradient, setShowGradient] = useState(false)
    const { formatCustomDate } = useFormatDate()

    const variables = useMemo(() => {
        return {
            fecha_inicio_corte: null,
            fecha_corte: {
                dia_inicial: fecha_corte_inicial,
                dia_final: fecha_corte_final,
            },
        }
    }, [fecha_corte_inicial, fecha_corte_final])

    const { data = [], load, root } = useFetchCortesHistorial({ variables, fetch: true, disabled: !ready })

    const headers = useHeader(data)
    const { rows, handleFilter } = useRows(data)

    const getDates = () => {
        const primer_corte = root?.[0]
        const ultimo_corte = root?.[root?.length - 1]

        const fecha_corte_inicio = primer_corte?.fecha_inicio_corte || fecha_inicial.toISOString()
        const fecha_corte_fin = ultimo_corte?.fecha_fin_corte || fecha_final.toISOString()

        return {
            fecha_corte_inicio,
            fecha_corte_fin,
        }
    }

    const handlePdf = () => {
        const { fecha_corte_inicio, fecha_corte_fin } = getDates()
        if (fecha_corte_inicio && fecha_corte_fin) {
            corteDiaOpener({
                stateCorteDia: {
                    fecha: `${fecha_corte_inicio}&${fecha_corte_fin}`,
                },
            })

            const fechas = range
                ? `${formatCustomDate(fecha_inicial, "DD/MMM/YY")} - ${formatCustomDate(fecha_final, "DD/MMM/YY")}`
                : formatCustomDate(fecha_inicial, "DD/MMM/YY")
            localStorage.setItem("@fechas-corte", fechas)
        }
    }

    return (
        <Screen
            className="cortes-screen-l"
            title={range ? "Corte por fechas" : `Día ${formatCustomDate(fecha_inicial, "DD/MMM/YY")}`}
            close={true}
            headerRight={
                data.length > 0 ? (
                    <div className="caratulas-f__button" onClick={handlePdf}>
                        <Download height={18} width={18} color={"var(--primary)"} />
                        <span>{"Generar reporte"}</span>
                    </div>
                ) : (
                    <div className="caratulas-f__button-structure"></div>
                )
            }
        >
            {range && (
                <p className="caratulas-f__subtitle">
                    Fechas:{" "}
                    <span>
                        {`${formatCustomDate(fecha_inicial, "DD/MMM/YY")} al ${formatCustomDate(
                            fecha_final,
                            "DD/MMM/YY"
                        )}`}
                    </span>
                </p>
            )}
            <div
                className={
                    `caratulas-f__table${range ? " caratulas-f__table_range" : ""}` +
                    (showGradient ? " caratulas-f__table--show-gradient" : "")
                }
            >
                {!load ? (
                    data.length > 0 ? (
                        <FlexibleTable
                            onSelectedFilters={handleFilter}
                            onHasScrollChange={setShowGradient}
                            tableItems={{
                                ...{
                                    headers,
                                    rows: rows.map((row) => ({
                                        value: row.value.map(({ value }, index) => ({
                                            value:
                                                index === headers.length - 1 ? (
                                                    <CellActions
                                                        corteId={value}
                                                        item={data?.find(({ corte_id }) => corte_id === value)}
                                                    />
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
                            className="caratulas-f__empty"
                            icon="dollarCircle"
                            title={"Sin cortes"}
                            description={"Aquí podrás ver el listado de cortes"}
                        />
                    )
                ) : (
                    <TableSkeleton headers={headers} />
                )}
            </div>
        </Screen>
    )
}

export default CaratulaFecha
