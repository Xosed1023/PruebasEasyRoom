import { useState } from "react"
import { useParams } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import { CalendarButtons } from "src/pages/reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { useTableHeaderHistorialProduccion } from "./hooks/useTableHeaderHistorialProduccion"
import "./HistorialProduccion.css"
import {
    useGetAlmacenArticuloByArrayIdQuery,
    useHistorialProduccionInventarioQuery,
    useKpisHistorialProduccionQuery,
} from "src/gql/schema"
import { useTableHistorialProduccion } from "./hooks/useTableHistorialProduccion"
import { CardSkeleton } from "src/pages/inventario/sections/assortment-history/skeleton/Cards"
import Card from "src/shared/components/data-display/card/Card"
import cx from "classnames"
import { useCards } from "./hooks/useCardsHistorialProduccion"
import { useProfile } from "src/shared/hooks/useProfile"
import { options } from "src/pages/inventario/sections/assortment-history/AssortmentHistory.constants"
import { pagination_options } from "src/constants/pagination"

const HistorialProduccion = () => {
    const params = useParams()
    const { hotel_id } = useProfile()

    const articulo_id = params?.articulo_id || ""
    const [date, setDate] = useState<Date>(new Date())

    const { data: historial, loading: load } = useHistorialProduccionInventarioQuery({
        variables: {
            articulo_id: [articulo_id],
            hotel_id,
            fecha_produccion: {
                mes_y_anio: `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`,
            },
        },
    })

    const { data: kpis, loading: loadKpis } = useKpisHistorialProduccionQuery({
        variables: {
            articulo_id,
            hotel_id,
        },
    })

    const { data: articulo } = useGetAlmacenArticuloByArrayIdQuery({
        variables: { articulo_id, pagination_options },
    })

    const { rows, visibleData, handleSort } = useTableHistorialProduccion(historial)
    const { infoCards } = useCards(kpis)

    const headers = useTableHeaderHistorialProduccion(historial?.historial_producciones_inventarios || [])

    return (
        <Screen
            className="inventario__screen"
            title={`Historial de producción ${
                articulo?.almacenes_articulos?.[0] ? ` - ` + articulo?.almacenes_articulos?.[0]?.articulo?.nombre : ""
            }`}
            close={true}
            headerRight={
                <div>
                    <CalendarButtons
                        className="gastos-screen-header-controls"
                        currMonth={date.getMonth()}
                        setCurrMonth={(value) => setDate(new Date(date.getFullYear(), value, 1))}
                        currYear={date.getFullYear()}
                        setCurrYear={(value) => setDate(new Date(value, date.getMonth(), 1))}
                        monthNames={options.map(({ label }) => label)}
                    />
                </div>
            }
        >
            <section className="historial-produccion">
                <div className="inventario_home_cards_container">
                    {!loadKpis ? (
                        <div className="inventario-screen__cards animante__select">
                            {kpis &&
                                infoCards.map(({ title = "", value = "" }, index) => (
                                    <Card
                                        key={index}
                                        containerClassName={cx("inventario-screen__card-item")}
                                        className={"cortes-screen__card__contain"}
                                        title={title}
                                        number={value}
                                    />
                                ))}
                        </div>
                    ) : (
                        <CardSkeleton />
                    )}
                </div>
                <div className={"historial-produccion__table"}>
                    {!load ? (
                        visibleData ? (
                            <FlexibleTable
                                tableItems={{
                                    ...{
                                        headers: headers,
                                        rows: rows?.map((row) => ({
                                            value: row.value.map(({ value }, index) => ({
                                                value: value,
                                            })),
                                        })),
                                    },
                                }}
                                emptyState={{
                                    titile: "",
                                    subTitle: "No hay movimientos de producción de este artículo",
                                    headerIcon: "surveyFill",
                                }}
                                onSort={handleSort}
                            />
                        ) : (
                            <Empty
                                className={"historial-produccion__empty"}
                                title=""
                                description="No hay movimientos de producción de este artículo"
                                icon="surveyFill"
                            />
                        )
                    ) : (
                        <TableSkeleton headers={headers} />
                    )}
                </div>
            </section>
        </Screen>
    )
}

export default HistorialProduccion
