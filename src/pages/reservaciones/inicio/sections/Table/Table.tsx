import { useEffect, useState } from "react"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { v4 as uuid } from "uuid"
import cx from "classnames"
import "./Table.css"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { tabs, tabsValet } from "../../Inicio.constants"
import { AddButton } from "../../components/AddButton/AddButton"
import { Search } from "../../components/Search/Search"
import { Option } from "src/shared/components/forms/selelct-dropdown/Dropdown"
import {
    EstadosReservas,
    EstadpPago,
    GetReservacionesTableQuery,
    useGetReservacionesTableQuery,
    useGetTiposHabitacionQuery,
} from "src/gql/schema"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { DrawerSection } from "../Drawer/Drawer"
import { useDate } from "src/shared/hooks/useDate"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import { iLikeText } from "src/shared/helpers/ILikeText"
import useSortTable from "src/shared/hooks/useSortTable"
import Icon from "src/shared/icons"
import { selectDrawerSection, selectReservation } from "src/store/reservations/reservationsSlice"
// import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { Skeleton } from "../../components/Skeleton/Skeleton"
import { useProfile } from "src/shared/hooks/useProfile"
import { getOrigenLabel } from "src/pages/reservaciones/helpers/origen"
import { CalendarButtons } from "../../components/CalendarButtons/CalendarButtons"
import Badge from "src/shared/components/data-display/Badge/Badge"
import { RoleNames } from "src/shared/hooks/useAuth"

const options: Option[] = [
    { label: "Enero", value: "0" },
    { label: "Febrero", value: "1" },
    { label: "Marzo", value: "2" },
    { label: "Abril", value: "3" },
    { label: "Mayo", value: "4" },
    { label: "Junio", value: "5" },
    { label: "Julio", value: "6" },
    { label: "Agosto", value: "7" },
    { label: "Septiembre", value: "8" },
    { label: "Octubre", value: "9" },
    { label: "Noviembre", value: "10" },
    { label: "Diciembre", value: "11" },
]

const currentDate = new Date()

export const TableSection = () => {
    const { hotel_id, rolName } = useProfile()
    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    lastDayOfMonth.setHours(23, 59, 59, 999)
    const [showGradient, setShowGradient] = useState(false)

    const { data, refetch, loading } = useGetReservacionesTableQuery({
        variables: {
            id: [],
            hotel_id,
            fecha_entrada: {
                fecha_inicial: firstDayOfMonth,
                fecha_final: lastDayOfMonth,
            },
        },
        fetchPolicy: "no-cache",
    })

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const useReservacionesQuery = (fechaInicial, fechaFinal) => {
        return useGetReservacionesTableQuery({
            variables: {
                id: [],
                hotel_id,
                fecha_entrada: {
                    fecha_inicial: fechaInicial,
                    fecha_final: fechaFinal,
                },
            },
            fetchPolicy: "no-cache",
        })
    }

    const { data: dataDiaActual, refetch: refetchDiaActual } = useReservacionesQuery(startOfDay, endOfDay)
    const { data: dataMesActual, refetch: refetchMesActual } = useReservacionesQuery(firstDayOfMonth, lastDayOfMonth)

    const { areSameDay, setHHMMSS, UTCStringToLocalDate } = useDate()
    const [date, setDate] = useState<number>(currentDate.getMonth())
    const [year, setYear] = useState<number>(currentDate.getFullYear())
    const [filterLoading, setFilterLoading] = useState<boolean>(false)

    const headers = tableItems()

    const tabsToUse = rolName === RoleNames.valet ? tabsValet : tabs
    const [path, setPath] = useState<string>(tabsToUse[0].path)

    const [selectReserva, setSelectReserva] = useState<string>("")

    const [reservasQuery, setReservasQuery] = useState<GetReservacionesTableQuery["reservas"]>([])
    // Todas las reservas formateadas para la tabla (este array no se muestra directamente, es para tener una referencia a todas las reservas y hacerle filtros)
    const [dataTables, setDataTables] = useState<
        {
            goTo: string
            value: {
                value: JSX.Element | string
                sortValue?: string
                fromHeaderSort?: string
            }[]
        }[]
    >([])

    // las reservas filtradas para ser mostradas (este array se muestra directamente en la tabla)
    const [dataTable, setDataTable] = useState<
        {
            goTo: string
            value: {
                value: JSX.Element | string
                sortValue?: string
                fromHeaderSort?: string
            }[]
        }[]
    >(dataTables)
    // las reservas filtradas para ser mostradas sin ordenamiento, (para regresar al estado orginal al cancelar el ordenamiento)
    const [startDataTable, setStartDataTable] = useState(dataTable)

    useEffect(() => {
        setReservasQuery(data?.reservas || [])
    }, [data])

    useEffect(() => {
        const now = new Date()
        setDataTables(
            reservasQuery?.map((reserva) => ({
                goTo: reserva?.reserva_id,
                value: [
                    {
                        value: reserva?.codigo_ota
                            ? reserva?.codigo_ota
                            : `ER-${reserva?.folio.toString().padStart(3, "0")}`,
                    },
                    {
                        value: formatTableStateAsignacion({
                            idHabitacion: reserva?.habitacion_id || "",
                            numHabitacion: reserva?.habitacion?.numero_habitacion || "",
                        }),
                        fromHeaderSort: headers[0].value,
                        sortValue: reserva?.habitacion?.numero_habitacion || "",
                    },
                    { value: reserva?.origen ? getOrigenLabel(reserva?.origen) : "" },
                    { value: reserva?.tipo_de_habitacion?.nombre || "" },
                    {
                        value: <div className="reservas-screen__table-cell__huesped">{reserva?.nombre_huesped}</div>,
                    },

                    {
                        value:
                            formatDateComplitSlash(UTCStringToLocalDate(reserva?.fecha_entrada) || "") +
                            " - " +
                            formatDateComplitSlash(UTCStringToLocalDate(reserva?.fecha_salida) || ""),
                        fromHeaderSort: headers[4].value,
                        sortValue: reserva?.fecha_entrada,
                    },
                    { value: `${reserva?.tarifa?.nombre} - ${formatCurrency(reserva?.tarifa?.costo_habitacion || 0)}` },
                    {
                        value: formatTableState({
                            statePago: reserva?.estado_pago,
                            fechaCancel: reserva?.fecha_cancelacion || "",
                            isNoShow:
                                reserva?.estado !== EstadosReservas.CheckIn &&
                                now.getTime() >
                                    setHHMMSS({
                                        startDate: UTCStringToLocalDate(reserva?.fecha_salida),
                                        newHour: reserva?.tarifa?.hora_checkout || "",
                                    }).getTime() +
                                        60 * 1000,
                        }),
                    },
                ],
            }))
        )
    }, [reservasQuery])

    const dispatch = useDispatch()

    useEffect(() => {
        setDataTable(dataTables)
        setStartDataTable(dataTables)
    }, [dataTables])

    const [tabsValue, setTabsValue] = useState<
        {
            label: string
            number: number
            path: string
        }[]
    >([])

    useEffect(() => {
        const tabsList: {
            label: string
            number: number
            path: string
        }[] = []
        tabsToUse.map((v) => {
            if (v.path === "/all") {
                tabsList.push({
                    label: v.label,
                    path: v.path,
                    number: data?.reservas.length || 0,
                })
            }
            if (v.path === "/current") {
                tabsList.push({
                    label: v.label,
                    path: v.path,
                    number: dataDiaActual?.reservas.length || 0,
                })
            }
            if (v.path === "/currentmonth" && rolName === RoleNames.valet) {
                tabsList.push({
                    label: v.label,
                    path: v.path,
                    number: dataMesActual?.reservas.length || 0,
                })
            }
        })
        setTabsValue(tabsList)
    }, [data, dataDiaActual, dataMesActual, rolName])

    const searchFilter = (value) => {
        let reservas = data?.reservas
        reservas =
            path === "/current"
                ? dataDiaActual?.reservas.filter((res) => areSameDay(new Date(res.fecha_entrada), new Date()))
                : path === "/currentmonth" && rolName === RoleNames.valet
                ? dataMesActual?.reservas.filter((res) => {
                    const fechaEntrada = new Date(res.fecha_entrada)
                    return fechaEntrada >= firstDayOfMonth && fechaEntrada <= lastDayOfMonth
                })
                : data?.reservas

        if (!value) {
            return setReservasQuery(reservas || [])
        }

        setReservasQuery(
            reservas?.filter((res) => {
                return (
                    iLikeText({ fullText: res.nombre_huesped, searchText: value }) ||
                    res.habitacion.numero_habitacion === value
                )
            }) || []
        )
    }

    useEffect(() => {
        if (path === "/all") {
            if (data) {
                const tableNew = data?.reservas
                if (tableNew) {
                    setReservasQuery(tableNew)
                }
            }
        } else if (path === "/current") {
            if (data) {
                const dataTableFilter = dataDiaActual?.reservas || []
                if (dataTableFilter) {
                    setReservasQuery(dataTableFilter)
                }
            }
        } else if (path === "/currentmonth") {
            if (data) {
                const dataTableFilter = dataMesActual?.reservas || []
                if (dataTableFilter) {
                    setReservasQuery(dataTableFilter)
                }
            }
        }
    }, [path, data, dataDiaActual, dataMesActual])

    const toggleDrawerState = (value: boolean) => {
        dispatch(selectDrawerSection("detail"))
        dispatch(toggleDrawer(value))
    }

    useEffect(() => {
        if (isDrawerOpen) {
            return
        }
        const fecha_inicial =
            path === "/current"
                ? startOfDay
                : path === "/currentmonth"
                ? new Date(year, new Date().getMonth(), 1)
                : new Date(year, date, 1)

        const fecha_final =
            path === "/current"
                ? endOfDay
                : path === "/currentmonth"
                ? new Date(year, new Date().getMonth() + 1, 0)
                : new Date(year, date + 1, 0)

        fecha_final.setHours(23, 59, 59, 999)

        if (path === "/current") {
            refetchDiaActual({
                id: [],
                hotel_id,
                fecha_entrada: {
                    fecha_inicial,
                    fecha_final,
                },
            })
        } else if (path === "/currentmonth") {
            refetchMesActual({
                id: [],
                hotel_id,
                fecha_entrada: {
                    fecha_inicial,
                    fecha_final,
                },
            })
        } else if (path === "/all") {
            refetch({
                id: [],
                hotel_id,
                fecha_entrada: {
                    fecha_inicial,
                    fecha_final,
                },
            })
        }
    }, [isDrawerOpen, path, year, date, refetch, refetchDiaActual, refetchMesActual])

    useEffect(() => {
        setFilterLoading(true)
        const fecha_inicial = new Date(year, date, 1)
        const fecha_final = new Date(year, date + 1, 0)
        fecha_final.setHours(23, 59, 59, 999)
        refetch({
            id: [],
            hotel_id,
            fecha_entrada: {
                fecha_inicial: fecha_inicial,
                fecha_final: fecha_final,
            },
        })
        setTimeout(() => setFilterLoading(false), 1000)
    }, [date, year])

    const [onFilterTable, setOnFilterTable] = useState<
        {
            filter: string
            fromHeader: string
        }[]
    >([])

    // filtrar reservas
    useEffect(() => {
        const itemsFiltered: any[] = []
        if (!onFilterTable.length) {
            setStartDataTable(dataTables)
            return setDataTable(dataTables)
        }
        onFilterTable.forEach((item, index) => {
            itemsFiltered.push(
                ...dataTables.filter((row) =>
                    row.value.some((col) => {
                        return (col.value as unknown as string) === item.filter
                    })
                )
            )
        })
        setStartDataTable(itemsFiltered)
        setDataTable(itemsFiltered)
    }, [onFilterTable])

    const drawerCreate = (id: string) => {
        setSelectReserva(id)
        dispatch(selectReservation(data?.reservas.find((r) => r.reserva_id === id)))
        toggleDrawerState(true)
    }

    const onSortData = (value: { sort: "up" | "down" | null; fromHeader: string; idx: number } | null) => {
        if (!value) {
            return
        }
        setDataTable(
            useSortTable({ i: value.idx, sortedData: dataTable, startList: startDataTable, sortState: value.sort })
        )
    }

    return (
        <section className="reservas-screen__table-section">
            {loading || filterLoading ? (
                <div>
                    <div className="reservas-screen__table__filter-section">
                        <TabMenu
                            className="reservas-screen__table__tabs"
                            tabList={tabsValue}
                            value={path}
                            showNumerOnNoItems
                            onChange={(value) => {
                                setPath(value)
                            }}
                        />
                        <div className="reservas-screen__table__search-section">
                            <Search onChange={searchFilter} />
                            {path === "/all" && (
                                <>
                                    <CalendarButtons
                                        className="gastos-screen-header-controls"
                                        currMonth={date}
                                        setCurrMonth={setDate}
                                        currYear={year}
                                        setCurrYear={setYear}
                                        monthNames={options.map(({ label }) => label)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="reservas-screen__table">
                        <Skeleton />
                    </div>
                </div>
            ) : data?.reservas.length !== 0 ? (
                <div>
                    <div className="reservas-screen__table__filter-section">
                        <TabMenu
                            className="reservas-screen__table__tabs"
                            tabList={tabsValue}
                            value={path}
                            showNumerOnNoItems
                            onChange={(value) => {
                                setPath(value)
                            }}
                        />
                        <div className="reservas-screen__table__search-section">
                            <Search onChange={searchFilter} />
                            {path === "/all" && (
                                <>
                                    <CalendarButtons
                                        className="gastos-screen-header-controls"
                                        currMonth={date}
                                        setCurrMonth={setDate}
                                        currYear={year}
                                        setCurrYear={setYear}
                                        monthNames={options.map(({ label }) => label)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div
                        className={`reservas-screen__table-wrapper${
                            showGradient ? " reservas-screen__table-wrapper--show-gradient" : ""
                        }`}
                    >
                        <FlexibleTable
                            tabIndex={0}
                            onHasScrollChange={setShowGradient}
                            onSelectedFilters={(value) => setOnFilterTable(value)}
                            tableItems={{
                                ...{
                                    headers: headers,
                                    rows: dataTable.map((table) => ({
                                        ...table,
                                    })),
                                },
                            }}
                            onSort={(value) => onSortData(value)}
                            emptyState={{
                                headerIcon: "BedFilled",
                                titile: "No se encontraron reservas",
                            }}
                            goTo={(id) => {
                                drawerCreate(id)
                            }}
                        ></FlexibleTable>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="reservas-screen__table__filter-section">
                        <TabMenu
                            className="reservas-screen__table__tabs"
                            tabList={tabsValue}
                            value={path}
                            showNumerOnNoItems
                            onChange={(value) => {
                                setPath(value)
                            }}
                        />
                        <div className="reservas-screen__table__search-section">
                            <Search onChange={searchFilter} />
                            {path === "/all" && (
                                <>
                                    <CalendarButtons
                                        className="gastos-screen-header-controls"
                                        currMonth={date}
                                        setCurrMonth={setDate}
                                        currYear={year}
                                        setCurrYear={setYear}
                                        monthNames={options.map(({ label }) => label)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="gastos-empty-state">
                        <EmptyState
                            title="No hay reservaciones"
                            subtitle="Comienza registrando tus reservas aquí"
                            headerIcon="BedFilled"
                        />
                    </div>
                </div>
            )}
            <DrawerSection visible={isDrawerOpen} id={selectReserva} onClose={() => toggleDrawerState(false)} />
            {rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && <AddButton />}
        </section>
    )
}

const formatTableState = ({
    statePago,
    fechaCancel,
    isNoShow,
}: {
    statePago: EstadpPago
    fechaCancel?: Date
    isNoShow: boolean
}) => {
    const pendiente = statePago === EstadpPago.PagoParcial || statePago === EstadpPago.SinPagos
    const fechaCancelExists = !isNaN(new Date(fechaCancel || "").getDate())

    const state = isNoShow
        ? "disabled"
        : fechaCancelExists
        ? "danger"
        : pendiente
        ? "warning"
        : statePago === EstadpPago.Pagado
        ? "success"
        : "success"

    const label = isNoShow
        ? "No show"
        : fechaCancelExists
        ? "Cancelada"
        : pendiente
        ? "Pendiente"
        : statePago === EstadpPago.Pagado
        ? "Pagada"
        : ""

    return (
        <div className="reservas-screen__table-cell__pago">
            <Badge label={label} state={state} />
        </div>
    )
}
const formatTableStateAsignacion = ({
    idHabitacion,
    numHabitacion,
}: {
    idHabitacion?: string | null
    numHabitacion: string
}) => {
    return (
        <div className="reservas-screen__table-cell__pago">
            <div
                key={uuid()}
                className={cx({
                    "reservas-screen__table-cell__pago-text": true,
                    "reservas-screen__table-cell--cancelada": idHabitacion === null || idHabitacion === undefined,
                })}
            >
                {!idHabitacion && (
                    <Icon name="dot" color="red" width={10} height={10} style={{ marginRight: "12px" }} />
                )}
                {idHabitacion ? `#${numHabitacion}` : "Sin asignar"}
            </div>
        </div>
    )
}

const tableItems = () => {
    const { hotel_id } = useProfile()
    const { data } = useGetTiposHabitacionQuery({
        variables: { hotel_id: hotel_id },
    })

    // Definir una variable para almacenar los tipos de habitación

    const [tiposTipe, settiposTipe] = useState<{ value: string; valueToDisplay: string }[]>([])

    useEffect(() => {
        if (data && data?.tipo_habitaciones) {
            // Mapear los tipos de habitación desde la respuesta GraphQL
            settiposTipe(
                data?.tipo_habitaciones?.map((value) => ({
                    value: value?.nombre || "",
                    valueToDisplay: value?.nombre || "",
                }))
            )
        }
    }, [data])

    // Definir la estructura de la tabla
    const [tableItems, settableItems] = useState<
        {
            value: string
            sort?: boolean
            filterMenu?: { value: string; valueToDisplay: string }[]
            isFilterUnique?: boolean
        }[]
    >([])

    useEffect(() => {
        settableItems([
            {
                value: "Código",
            },
            {
                value: "Habitación",
                sort: true,
            },
            {
                value: "Origen",
            },
            {
                value: "Tipo",
                filterMenu: tiposTipe,
                isFilterUnique: true,
            },
            {
                value: "Huésped",
            },
            {
                value: "Estancia",
            },
            {
                value: "Tarifa",
            },
            {
                value: "Pago",
            },
        ])
    }, [tiposTipe])

    return tableItems
}
