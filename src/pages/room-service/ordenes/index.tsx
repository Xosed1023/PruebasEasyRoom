import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useProfile } from "src/shared/hooks/useProfile"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useHeader } from "./hooks/useHeader"
import { useModulos } from "src/shared/hooks/useModulos"
import { removeItems } from "../detalle-compra/DetalleCompra.helpers"
import { getSaveItems } from "../productos/Products.helpers"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import FlexibleTable, { TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import Screen from "src/shared/components/layout/screen/Screen"
import { DrawerSection } from "./drawer/Drawer"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { InputText } from "src/shared/components/forms"
import { RootState } from "src/store/store"
import { selectOrder } from "src/store/orders/ordersSlice"
import { useDate } from "src/shared/hooks/useDate"
import { OrdenesQuery, useOrdenesPaginadasLazyQuery } from "src/gql/schema"
import { useGenTable } from "./hooks/useGenTable"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
//import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { OrdenesPaths, OrdenesTabs, OrigenOrden } from "./Ordenes.types"
import Icon from "src/shared/icons"
import "./Ordenes.css"
import { useFilters } from "./hooks/useFilters"
import useGetCurrentDate from "src/shared/hooks/useGetCurrentDate"
import { getShortDateFormatted } from "src/utils/date"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import InputDateModalDeselectable from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModalDeselectable"
import { debounce } from "src/utils/lodash"

interface OrdenesState {
    roomService: {
        list?: OrdenesQuery["ordenes"]
    }
    mostrador: {
        list?: OrdenesQuery["ordenes"]
    }
    restaurante: {
        list?: OrdenesQuery["ordenes"]
    }
    todas: {
        list?: OrdenesQuery["ordenes"]
    }
}

function Ordenes(): JSX.Element {
    const dispatch = useDispatch()

    const [rowsOrdenes, setRowsOrdenes] = useState<FlexibleTableRow[]>()
    const [ordenes, setOrdenes] = useState<OrdenesState>()
    const [type, setType] = useState<OrdenesPaths>("todas")
    const [tabs, setTabs] = useState<OrdenesTabs[]>([])
    const [load, setLoad] = useState<boolean>(true)
    const [openDateModal, setOpenDateModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [search, setSearch] = useState<string>("")

    // Paginacion
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [variables, setVariables] = useState<any>({
        pagination_options: {
            take: 10,
            page: 1
        },
        estado: null,
        estado_pago: null,
        origen: null,
        turno_id: null,
        orden: null,
        fecha_registro: null
    })

    const [showGradient, setShowGradient] = useState(false)

    const { currentDate } = useGetCurrentDate()
    const dateHotel = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    const navigate = useNavigate()

    const { restaurante: withRestaurante } = useModulos()
    const { handleFilter } = useFilters()

    const { genTable } = useGenTable()
    const { headers } = useHeader(ordenes?.todas?.list || [], type, withRestaurante)
    //const turnoActual = useTurnoActual()
    const { hotel_id } = useProfile()

    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const { localDateToUTCString } = useDate()

    const [getOrdenes] = useOrdenesPaginadasLazyQuery()

    const toggleDrawerState = (value: boolean) => {
        dispatch(toggleDrawer(value))
    }

    const getData = async () => {
        try {
            const { data } = await getOrdenes({
                variables: {
                    hotel_id: hotel_id,
                    ...variables
                },
            })

            const dataOrdenes = data?.ordenes_paginadas?.ordenes || []
            const conteos_back = data?.ordenes_paginadas?.conteos

            setTotalPages(data?.ordenes_paginadas?.paginacion?.total_paginas || 0)
            if (dataOrdenes?.length > 0) {
                const ordenarDescendentePorFecha = (ordenesList: OrdenesQuery["ordenes"]) =>
                    [...ordenesList].sort(
                        (a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()
                    )
                const filterOrdenes = withRestaurante
                    ? dataOrdenes
                    : dataOrdenes?.filter((orden) => orden.origen_orden !== OrigenOrden.Restaurante)

                const roomService = ordenarDescendentePorFecha(
                    dataOrdenes?.filter((orden) => orden.origen_orden === OrigenOrden.RoomService)
                )
                const restaurante = ordenarDescendentePorFecha(
                    dataOrdenes?.filter((orden) => orden.origen_orden === OrigenOrden.Restaurante)
                )
                const mostrador = ordenarDescendentePorFecha(
                    dataOrdenes?.filter((orden) => orden.origen_orden === OrigenOrden.Mostrador)
                )

                const todas = ordenarDescendentePorFecha(filterOrdenes)
                
                const conteos_total = {
                    total: conteos_back?.total || 0,
                    mostrador: conteos_back?.mostrador || 0,
                    room_service: conteos_back?.room_service || 0,
                    restaurante: conteos_back?.restaurante || 0
                }

                const conteos_dinamicos = {
                    total:  todas?.length || 0,
                    mostrador: mostrador?.length || 0,
                    room_service: roomService?.length || 0,
                    restaurante: restaurante?.length || 0
                }

                const conteos = search ? conteos_dinamicos : conteos_total

                setOrdenes({
                    roomService: { list: [] },
                    mostrador: { list: [] },
                    restaurante: { list: [] },
                    todas: { list: todas },
                })
                buildTable(todas)
                setTabs([
                    { label: "Todas las órdenes", path: "todas", number: conteos.total },
                    { label: "Room service", path: "room_service", number: conteos.room_service },
                    { label: "Mostrador", path: "mostrador", number: conteos.mostrador },
                    ...(withRestaurante
                        ? [{ label: "Restaurante", path: "restaurante", number: conteos.restaurante }]
                        : []),
                ])
            } else {
                setTabs([
                    { label: "Todas las órdenes", path: "todas", number: 0 },
                    { label: "Room service", path: "room_service", number: 0 },
                    { label: "Mostrador", path: "mostrador", number: 0 },
                    ...(withRestaurante ? [{ label: "Restaurante", path: "restaurante", number: 0 }] : []),
                ])
                setRowsOrdenes([])
                setOrdenes({ roomService: {}, restaurante: {}, mostrador: {}, todas: {} })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoad(false)
        }
    }

    const buildTable = (ordenes: OrdenesQuery["ordenes"] = []) => {
        setRowsOrdenes(genTable({ ordenes, filter: type }))
    }

    const handleFilterTable = (filters: TableFilter[]) => {
        const values = ordenes?.todas.list || []
        /*
            type === "todas"
                ? ordenes?.todas.list
                : type === "room_service"
                ? ordenes?.roomService?.list
                : type === "mostrador"
                ? ordenes?.mostrador.list
                : ordenes?.restaurante.list
        */

        const filteredOrdenes: OrdenesQuery["ordenes"] = values || []

        if (filters.length > 0 ){
            const find = filters.find((i)=>i.idx === 8)
            if(find) {
                const filtered: OrdenesQuery["ordenes"] = handleFilter(filters, filteredOrdenes)
                
                if(filtered.length <= 10) {
                    setTotalPages(1)
                }

                return setRowsOrdenes(genTable({ ordenes: filtered, filter: type }))
            } else {
                const vars: any = {
                    estado: variables?.estado || null,
                    estado_pago: variables?.estado_pago || null,
                    origen: variables?.origen || null,
                    turno_id: variables?.turno_id || null
                }
                filters.forEach(({ idx, filter })=>{
                    const key  = idx === 1 ? "estado" :  idx === 2 ? "origen" : idx === 3 ? "turno_id" : idx === 9 ? "estado_pago" : ""
                    if(key) {
                        vars[key] = !filter.includes("todos") ? filter : null
                    }
                })

                setVariables({...variables, ...vars})

                return
            }
        } else {
            setVariables({...variables, estado: null, estado_pago: null, origen: null, turno_id: null })
            return
        }
    }

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSelectedDate(null)
            setLoad(true)
            setVariables({
                pagination_options: {
                    take: 10,
                    page: 1
                },
                estado: null,
                estado_pago: null,
                origen: null,
                turno_id: null,
                fecha_registro: null,
                orden: value || null
            })
        }, 500),
        [variables]
    )

    const handleDate = (v: Date | null) => {
        setLoad(true)
        setSelectedDate(v)
        setSearch("")

        const fecha_registro = v
            ? {
                fecha_inicial: localDateToUTCString(
                    new Date(v.getFullYear(), v.getMonth(), v.getDate(), 0, 0, 0)
                ),
                fecha_final: localDateToUTCString(
                    new Date(v.getFullYear(), v.getMonth(), v.getDate(), 23, 59, 59)
                ),
            }
            : null

        setVariables({
            pagination_options: {
                take: 10,
                page: 1
            },
            estado: null,
            estado_pago: null,
            origen: null,
            turno_id: null,
            fecha_registro,
            orden: null
        })
    }

    /*
    const filterData = (search) => {
        //función para obtener los datos de la orden por filtro
        const arrayOrders =
            type === "todas"
                ? ordenes?.todas?.list
                : type === "room_service"
                ? ordenes?.roomService?.list
                : type === "restaurante"
                ? ordenes?.restaurante?.list
                : ordenes?.mostrador?.list
        if (search) {
            const filterData = arrayOrders?.filter((orden: any) =>
                `RS-${orden.orden}`.toLowerCase().includes(`${search}`.toLowerCase())
            )
            if (filterData) {
                buildTable(filterData)
            }
        } else {
            buildTable(arrayOrders || [])
        }
    }
    */

    useEffect(() => {
        getData()
    }, [withRestaurante, variables])

    useEscapeKey({
        onEscape: () => {
            navigate(-1)
        },
    })

    return (
        <Screen
            title={"Órdenes"}
            subtitle={selectedDate ? getShortDateFormatted(selectedDate) : ""}
            className="ordenes__screen"
            contentClassName="ordenes"
            back={true}
            onBack={() => {
                navigate(-1)
                if (getSaveItems()) removeItems()
            }}
            headerRight={
                <div className="ordenes__search">
                    <InputText
                        icon={Icon}
                        iconProps={{ name: "searchLg", color: "var(--primary)" }}
                        className="ordenes__search__input"
                        type={"text"}
                        placeholder="Busca por número de órden"
                        value={search}
                        onChange={(e) => {
                            const value = e.target.value
                            setSearch(value)
                            handleSearch(value)
                        }}
                    />
                    <button
                        onClick={() => setOpenDateModal(true)}
                        className={`ordenes__icon-calendar ${selectedDate ? "ordenes__icon-calendar--active" : ""}`}
                    >
                        <Icon
                            name="calendar"
                            height={18}
                            width={18}
                            color={selectedDate ? "var(--primary)" : undefined}
                        />
                    </button>

                    <InputDateModalDeselectable
                        isOpen={openDateModal}
                        onClose={() => setOpenDateModal(false)}
                        isRange={false}
                        value={selectedDate ? [selectedDate] : []}
                        onChange={(date) => {
                            if (!date || (Array.isArray(date) && date.length === 0)) {
                                handleDate(null)
                                return
                            }
                            const selected = Array.isArray(date) ? date[0] : date
                            const isTodayOrPast = selected <= dateHotel
                            if (!isTodayOrPast) {
                                return
                            }

                            handleDate(selected)
                        }}
                        onReset={() => {
                            handleDate(null)
                        }}
                        onConfirm={() => setOpenDateModal(false)}
                        modalClosableOnClickOutside={true}
                        disabledAfterOrEqualDate={
                            new Date(dateHotel.getFullYear(), dateHotel.getMonth(), dateHotel.getDate() + 1)
                        }
                        maxDate={dateHotel}
                        allowDateDeselect={true}
                    />
                </div>
            }
        >
            <section className="ordenes__container">
                <div className="ordenes__container-filters">
                    <TabMenu
                        className="ordenes__container-tabs"
                        tabList={tabs}
                        value={type}
                        onChange={(value) => {
                            setType(value as OrdenesPaths)
                            setVariables({...variables, origen: value !== "todas" ? value : null, pagination_options: { take: 10, page: 1 }})
                        }}
                        showNumerOnNoItems={true}
                    />
                </div>
                {load ? (
                    <div className="ordenes__table">
                        <TableSkeleton headers={headers} />
                    </div>
                ) : (
                    <div className="ordenes__table">
                        <TablePaginatorWrapper
                            pages={totalPages > 1 ? totalPages : 0}
                            currentPage={currentPage}
                            onChange={(page)=>{
                                setCurrentPage(page)
                                setVariables({...variables, pagination_options: { take: 10, page }})
                            }}
                        >
                            <div
                                className={`ordenes__table-container${
                                    showGradient ? " ordenes__table-container--show-gradient" : ""
                                }`}
                            >
                                <FlexibleTable
                                    onSelectedFilters={handleFilterTable}
                                    onHasScrollChange={setShowGradient}
                                    tableItems={{
                                        ...{
                                            headers: headers,
                                            rows:
                                                rowsOrdenes?.map((row) => ({
                                                    value: row?.value?.map(({ value }, index, arr) => ({
                                                        value,
                                                        filterValue: value?.toString().toLowerCase() || "todos_turnos",
                                                        fromHeaderFilter: headers[index].value,
                                                    })),
                                                    goTo: row.goTo,
                                                })) || [],
                                        },
                                    }}
                                    goTo={(value) => {
                                        toggleDrawerState(true)
                                        dispatch(selectOrder(value))
                                    }}
                                    emptyState={{
                                        titile: "No tienes órdenes registradas",
                                        headerIcon: "dollarCircle",
                                    }}
                                />
                            </div>
                        </TablePaginatorWrapper>
                    </div>
                )}
            </section>
            <DrawerSection
                visible={isDrawerOpen}
                onClose={() => {
                    toggleDrawerState(false)
                    dispatch(selectOrder(""))
                }}
            />
        </Screen>
    )
}

export default Ordenes
