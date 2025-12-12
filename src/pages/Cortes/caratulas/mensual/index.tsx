import { useState, useMemo } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import Empty from "src/shared/components/data-display/empty/Empty"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"
import { months } from "src/utils/date"
import { useProfile } from "src/shared/hooks/useProfile"
import { headers } from "./Mensual.constants"
import "./../../CortesScreen.css"
import "./Mensual.css"
import { useFetch } from "../../../../shared/hooks/useFetch"

const Download = ({ path = "" }) => (
    <div className="caratulas-m__download" onClick={() => window.open(`/pdf/caratula-periodo${path}`)}>
        <Icon name={"Download"} color={"var(--primary)"} />
    </div>
)

function CaratulaMensual(): JSX.Element {
    const [year, setYear] = useState(new Date().getFullYear())
    const [showGradient, setShowGradient] = useState(false);

    const { hotel_id } = useProfile()
    
    const { data: cortesPorAnio, refetch, load } = useFetch("/cortes/cortes_por_anio", {
        variables: {
            anio: new Date().getFullYear(),
            hotel_id
        },
        startFetch: true
    })

    const handleYear = (year: number) => {
        setYear(year)
        refetch({
            anio: year,
            hotel_id,
        })
    }

    const rows = useMemo(() => {
        const list: any[] = cortesPorAnio || []
        const orderList = list.sort((a, b) => a?.mes - b?.mes) || []

        const clearList: any[] =
            orderList?.map((item) => {
                return {
                    value: [
                        { value: `${months[item?.mes - 1 || 0]} ${year}` },
                        { value: `${item?.cortes_cerrados || 0} cortes` },
                        { value: getCurrencyFormat(item?.ingresos || 0) },
                        { value: getCurrencyFormat(item?.gastos || 0) },
                        { value: getCurrencyFormat(item?.utilidad || 0) },
                        { value: item?.incidencias || 0 },
                        { value: Number(item?.mes || 0) - 1 },
                    ],
                }
            }) || []
        return clearList
    }, [cortesPorAnio])

    return (
        <Screen
            className="cortes-screen-l"
            title="Carátulas mensuales"
            close={true}
            headerRight={
                <div className="caratulas-m__input">
                    <div className="caratulas-m__input-btn" onClick={() => handleYear(year - 1)}>
                        <Icon name="chevronleft" color={"var(--primary)"} />
                    </div>
                    <span>{year}</span>
                    <div className="caratulas-m__input-btn" onClick={() => handleYear(year + 1)}>
                        <Icon name="chevronRight" color={"var(--primary)"} />
                    </div>
                </div>
            }
        >
            <div className={`caratulas-m__table${showGradient ? " caratulas-m__table--show-gradient" : ""}`}>
                {!load ? (
                    rows.length > 0 ? (
                        <FlexibleTable
                            onHasScrollChange={setShowGradient}
                            tableItems={{
                                ...{
                                    headers,
                                    rows: rows.map((row) => ({
                                        value: row.value.map(({ value }, index) => ({
                                            // la última columna es la que va a tener este estilo
                                            value:
                                                index === headers.length - 1 ? (
                                                    <Download path={`/${value}/${year}`} />
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
                            className="caratulas-m__empty"
                            icon="dollarCircle"
                            title={"Sin resultados"}
                            description={"No hay resultados. Intenta de nuevo."}
                        />
                    )
                ) : (
                    <TableSkeleton headers={headers} />
                )}
            </div>
        </Screen>
    )
}

export default CaratulaMensual
