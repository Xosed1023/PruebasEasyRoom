import Screen from "src/shared/components/layout/screen/Screen"
import { CalendarButtons } from "src/pages/reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import { useEffect, useState } from "react"
import { CardsHome } from "../home/cards/CardsHome"
import { getCurrencyFormat } from "src/utils/string"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import {
    GetAlmacenArticuloByIdQuery,
    HistorialMovimientosInventario,
    useGetAlmacenArticuloByIdLazyQuery,
    useInforme_Historial_Movimientos_InventarioQuery,
} from "src/gql/schema"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import MovementDetails from "../movement-details/MovementDetails"
import { useProfile } from "src/shared/hooks/useProfile"
import { headers, options, currentDate, movementType, tipo } from "../../constants/movement-history"
import { CardSkeleton } from "../assortment-history/skeleton/Cards"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { getDateFormat } from "src/pages/Cortes/Sections/ResumenTurno/hooks/useResumenParams"
import { getHourFormat } from "src/utils/hour"
import { useDate } from "src/shared/hooks/useDate"
import "../../Inventario.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import useGetHistorialMovimientosInventario from "./hooks/useGetHistorialMovimientosInventario"
import SearchMovements from "./SearchMovements/SearchMovements"

const MovementHistory = () => {
    const [month, setMonth] = useState<number>(currentDate.getMonth())
    const [year, setYear] = useState<number>(currentDate.getFullYear())
    const [search, setSearch] = useState<string>("")
    const [isMovementOpen, setisMovementOpen] = useState<any>({ state: false, data: "" })
    const [itemSelected, setItemSelected] = useState<GetAlmacenArticuloByIdQuery>()
    const [getAlmacenArticuloById] = useGetAlmacenArticuloByIdLazyQuery()
    const { hotel_id } = useProfile()
    const { UTCStringToLocalDate } = useDate()
    const { skeletonRows } = tableSkeletonRows({ headers })
    const [showGradient, setShowGradient] = useState(false)

    const [page, setpage] = useState(1)

    const [dataTables, setDataTables] = useState<
        {
            goTo: string
            value: {
                value: JSX.Element | any
            }[]
            sortValue?: string
            fromHeaderSort?: string
        }[]
    >([])

    const [filters, setFilters] = useState<{
        tipoArticulo: string
        movimiento: string
        tipoMovimiento: string
    }>({
        tipoArticulo: "",
        movimiento: "",
        tipoMovimiento: "",
    })

    const { data: informe, loading: loadCards } = useInforme_Historial_Movimientos_InventarioQuery({
        variables: {
            hotel_id,
            fecha_registro: {
                fecha_inicial: getDateFormat(new Date(year, Number(month), 1), false),
                fecha_final: getDateFormat(new Date(year, Number(month) + 1, 0), true),
            },
        },
    })

    const dataCards = [
        {
            title: "Entrada de productos",
            number: getCurrencyFormat(
                informe?.informe_historial_movimientos_inventario?.entradas_productos?.total || 0
            ),
            unidad: informe?.informe_historial_movimientos_inventario?.entradas_productos?.unidades.toString() || 0,
        },
        {
            title: "Salidas por Room Service",
            number: getCurrencyFormat(informe?.informe_historial_movimientos_inventario?.salidas_venta?.total || 0),
            unidad: informe?.informe_historial_movimientos_inventario?.salidas_venta?.unidades.toString() || 0,
        },
        {
            title: "Entrada de insumos",
            number: getCurrencyFormat(informe?.informe_historial_movimientos_inventario?.entradas_insumos?.total || 0),
            unidad: informe?.informe_historial_movimientos_inventario?.entradas_insumos?.unidades.toString() || 0,
        },
        {
            title: "Salida de insumos",
            number: getCurrencyFormat(informe?.informe_historial_movimientos_inventario?.salidas_insumos?.total || 0),
            unidad: informe?.informe_historial_movimientos_inventario?.salidas_insumos?.unidades.toString() || 0,
        },
        {
            title: "Merma",
            number: getCurrencyFormat(informe?.informe_historial_movimientos_inventario?.merma?.total || 0),
            unidad: informe?.informe_historial_movimientos_inventario?.merma?.unidades.toString() || 0,
        },
    ]

    const { currentPage, items, totalPages, loading } = useGetHistorialMovimientosInventario({
        month,
        page,
        year,
        search,
        filters,
    })

    useEffect(() => {
        handleTableFormat(items || [])
    }, [items])

    useEffect(() => {
        setpage(1)
    }, [month, year, search, filters])

    const handleTableFormat = (array: HistorialMovimientosInventario[]) => {
        const products = array.map((hist) => ({
            goTo: JSON.stringify(hist) + "-/-" + hist.almacen_articulo_id,
            value: [
                { value: hist.folio ? `${hist.tipo?.[0]?.toUpperCase()} - ${hist.articulo?.folio}` : "-" },
                {
                    value: hist.nombre_articulo || "",
                    sortValue: hist.nombre_articulo,
                    fromHeaderSort: headers[1].value,
                },
                { value: movementType[hist.movimiento] || "" },
                { value: tipo[hist.tipo] || "" },
                { value: hist.origen_destino || "" },
                { value: hist.cantidad || "" },
                { value: hist.articulo?.unidad || "" },
                { value: formatCurrency(Number(hist.costo_actual || 0) || 0) },
                {
                    value: hist.fecha_registro
                        ? `${formatDateComplitSlash(UTCStringToLocalDate(hist.fecha_registro), false)} 
                        ${getHourFormat(UTCStringToLocalDate(hist.fecha_registro), true)}`
                        : "-",
                },
            ],
        }))
        setDataTables(products)
    }

    const onFilterTable = (f: any[]) => {
        const filterAcc = {
            tipoArticulo: "",
            movimiento: "",
            tipoMovimiento: "",
        }
        f?.map((filt) => {
            if (filt.filter && filt.fromHeader === "articulo") {
                filterAcc.tipoArticulo = filt.filter
            }
            if (filt.filter && filt.fromHeader === "Movimiento") {
                filterAcc.movimiento = filt.filter
            }
            if (filt.fromHeader === "Tipo" && filt.filter !== "") {
                filterAcc.tipoMovimiento = filt.filter
            }
        })
        setFilters(filterAcc)
    }

    const onSearch = (value: string) => {
        setSearch(value)
        if (value) {
            const searchHistorial: any[] = []
            items?.map((mov) => {
                if (mov.nombre_articulo.toLowerCase().includes(value.toLowerCase())) searchHistorial.push(mov)
            })
            handleTableFormat(searchHistorial)
        } else {
            handleTableFormat(items || [])
        }
    }

    return (
        <Screen
            className="history__screen"
            title={"Historial de inventario"}
            contentClassName="history"
            close={true}
            headerRight={
                <div className="inventario-screen-right">
                    <SearchMovements onSearch={onSearch} />
                    <CalendarButtons
                        className="gastos-screen-header-controls"
                        currMonth={month}
                        setCurrMonth={setMonth}
                        currYear={year}
                        setCurrYear={setYear}
                        monthNames={options?.map(({ label }) => label)}
                    />
                </div>
            }
        >
            <section className="history__container">
                <div className="inventario_home_cards_container">
                    {!loadCards ? <CardsHome data={dataCards} /> : <CardSkeleton />}
                </div>
                <TablePaginatorWrapper currentPage={currentPage || 1} onChange={setpage} pages={totalPages || 1}>
                    <div className={`history__container-table${showGradient ? " show-gradient" : ""}`}>
                        <FlexibleTable
                            onSelectedFilters={(value) => {
                                onFilterTable(value)
                            }}
                            emptyState={{
                                titile: "No hay movimientos registrados",
                                headerIcon: "ExtraTimeIcon",
                                subTitle:
                                    "¡Aún no tienes movimientos registrados! Empieza a agregar nuevos movimientos para llevar el control de tu historial.",
                            }}
                            tableItems={{
                                ...{
                                    headers: headers,
                                    rows: loading
                                        ? skeletonRows
                                        : dataTables?.map((row) => ({
                                            value: row.value?.map(({ value }, index) => ({
                                                value:
                                                    index === 2 ? (
                                                        <p
                                                            className={
                                                                "inventario-list-cell " +
                                                                value.toString().toLowerCase()
                                                            }
                                                        >
                                                            {value}
                                                        </p>
                                                    ) : (
                                                        value
                                                    ),
                                            })),
                                            goTo: row.goTo,
                                        })),
                                },
                            }}
                            goTo={(id) => {
                                // Para la nueva versión de esta pantalla no se consideró el detalle de artículo, pero se deja el código por sí en el futuro se considera el detalle.
                                const t = true
                                if (!t) {
                                    const info = id.split("-/-")
                                    getAlmacenArticuloById({
                                        variables: {
                                            almacen_articulo_id: info[1],
                                            hotel_id
                                        },
                                    }).then(({ data }) => {
                                        setItemSelected(data)
                                        setisMovementOpen({ state: true, data: info[0] })
                                    })
                                }
                            }}
                            onHasScrollChange={setShowGradient}
                        />
                    </div>
                </TablePaginatorWrapper>
            </section>
            {isMovementOpen.state && (
                <MovementDetails
                    isOpen={true}
                    onClose={() => {
                        setisMovementOpen({ state: false, data: "" })
                    }}
                    info={isMovementOpen.data}
                    almacenArticulo={itemSelected}
                />
            )}
        </Screen>
    )
}

export default MovementHistory
