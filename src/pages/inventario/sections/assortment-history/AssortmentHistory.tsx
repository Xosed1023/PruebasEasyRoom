import { useState } from "react"
import { useParams } from "react-router-dom"
import { useGetAlmacenArticuloForSurtidoQuery, useGetSurtidosByAlmacenArtIdQuery } from "src/gql/schema"
import Screen from "src/shared/components/layout/screen/Screen"
import { CalendarButtons } from "src/pages/reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import { CardsHome } from "../home/cards/CardsHome"
import { getCurrencyFormat } from "src/utils/string"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { CardSkeleton } from "./skeleton/Cards"
import { options } from "./AssortmentHistory.constants"
import { useTableHeader } from "./hooks/useTableHeader"
import { useTable } from "./hooks/useTable"
import { getDateFilters } from "./AssortmentHistory.helpers"
import { getDateString } from "src/utils/date"
import "./AssortmentHistory.css"

const current = new Date()

const AssortmentHistory = () => {
    const params = useParams()
    const almacen_articulo_id = params?.almacen_articulo_id || ""

    const [date, setDate] = useState<Date>(new Date())

    const { data: articulo, loading: loadProduct } = useGetAlmacenArticuloForSurtidoQuery({
        variables: { almacen_articulo_id },
    })
    const { data: surtidos, loading: load } = useGetSurtidosByAlmacenArtIdQuery({
        variables: { almacen_articulo_id, fecha_ingreso: getDateFilters(date) },
    })

    const { rows, visibleData, handleFilter } = useTable(surtidos)

    const product = articulo?.almacen_articulo?.articulo
    const visibleCards = current.getMonth() === date.getMonth() && current.getFullYear() === date.getFullYear()

    const headers = useTableHeader(surtidos?.surtidos || [])

    const unidades: number =
        Number(
            Number(articulo?.almacen_articulo.cantidad || 0) < 0
                ? Number(articulo?.almacen_articulo.cantidad || 0) * -1
                : articulo?.almacen_articulo.cantidad
        ) || 0
    const costo = Number(product?.costo?.monto || 0)

    const dataCards = [
        {
            title: "Total de unidades",
            number: unidades,
        },
        {
            title: "Costo final por unidad",
            number: getCurrencyFormat(costo),
        },
        {
            title: "Costo total de inventario",
            number: getCurrencyFormat(unidades * costo),
        },
        {
            title: "Valor comercial",
            number: getCurrencyFormat(Number(unidades) * Number(product?.precio?.monto || 0)),
        },
        {
            title: "Último surtido",
            number: articulo?.almacen_articulo.ultimo_surtido?.fecha_ingreso
                ? getDateString(articulo?.almacen_articulo.ultimo_surtido?.fecha_ingreso)
                : "-",
        },
    ]

    return (
        <Screen
            className="history__screen"
            title={`Historial de surtido${product?.nombre ? ` - ${product?.nombre}` : ""}`}
            contentClassName="history"
            close={true}
            headerRight={
                <div className="history-screen-right">
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
            <section className="history__container">
                <p className="history_header_subtitle">
                    {!loadProduct
                        ? product
                            ? `Almacén: ${articulo.almacen_articulo?.almacen?.nombre}`
                            : "Artículo no encontrado"
                        : "Cargando..."}
                </p>
                {visibleCards ? (
                    <div className="inventario_home_cards_container">
                        {!loadProduct ? <CardsHome data={dataCards} /> : <CardSkeleton />}
                    </div>
                ) : null}
                <div className={!visibleCards ? "assortment-history__table-large" : "assortment-history__table"}>
                    {!load ? (
                        visibleData ? (
                            <FlexibleTable
                                onSelectedFilters={handleFilter}
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
                                    subTitle: "No hay movimientos de surtido en este producto",
                                    headerIcon: "surveyFill",
                                }}
                            />
                        ) : (
                            <Empty
                                className={"assortment-history__empty"}
                                title=""
                                description="No hay movimientos de surtido este artículo"
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

export default AssortmentHistory
