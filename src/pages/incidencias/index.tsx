import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import FlexibleTable, {
    FlexibleTableRef,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { InputText } from "src/shared/components/forms"
import Screen from "src/shared/components/layout/screen/Screen"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { IncidenciaRow, Tabs } from "./Incidencia.types"
import { DrawerSection } from "./sections/drawer/Drawer"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { RootState } from "src/store/store"
import Icon from "src/shared/icons"
import "./Incidencias.css"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import { Estados_Incidencias, useCurrentDateQuery, useGetIncidenciasQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useHeader } from "./hooks/useTable"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { CalendarButtons } from "../reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import { monthNames } from "src/shared/components/forms/datapicker/date-picker"
import { getDateFormat } from "../Cortes/Sections/ResumenTurno/hooks/useResumenParams"
import { useDate } from "src/shared/hooks/useDate"
import { puestosRestaurante } from "src/constants/puestos"
import buildTable from "./helpers/build-table"
import BuildRows from "./helpers/build-rows"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import { RoleNames } from "src/shared/hooks/useAuth"

function Incidencias(): JSX.Element {
    const location = useLocation()

    const [type, setType] = useState<string>("todas")
    const [tabs, setTabs] = useState<Tabs[]>([])
    const { data: currentDate } = useCurrentDateQuery()
    const { UTCStringToLocalDate } = useDate()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const [rowsIncidencias, setRowsIncidencias] = useState<IncidenciaRow[]>([])
    const [page, setPage] = useState(1)
    const rowsPerPage = 10

    const [incidencias, setIncidencias] = useState<any>({})
    const [incidenciaSelected, setIncidenciaSelected] = useState<string>("")
    const [searchFolio, setSearchFolio] = useState<string>("")
    const [currMonth, setCurrMonth] = useState<number>(UTCStringToLocalDate(currentDate?.serverDate)?.getMonth())
    const [currYear, setCurrYear] = useState<number>(UTCStringToLocalDate(currentDate?.serverDate)?.getFullYear())
    const tableRef = useRef<FlexibleTableRef>(null)
    const [showGradient, setShowGradient] = useState(false)

    const paginatedRows = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage
        return rowsIncidencias.slice(startIndex, endIndex)
    }, [rowsIncidencias, page])

    const { hotel_id, rolName } = useProfile()
    const { data, loading, refetch } = useGetIncidenciasQuery({
        variables: {
            hotel_id,
            fecha_operacion: {
                fecha_inicial: getDateFormat(
                    new Date(
                        UTCStringToLocalDate(currentDate?.serverDate).getFullYear(),
                        UTCStringToLocalDate(currentDate?.serverDate).getMonth(),
                        1
                    ),
                    true
                ),
                fecha_final: getDateFormat(new Date(currYear, Number(currMonth) + 1, 1), true),
            },
        },
    })

    const headers = useHeader(data?.incidencias)
    const inputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)

    const toggleDrawerState = (value: boolean) => {
        dispatch(toggleDrawer(value))
    }

    useEffect(() => {
        const dataIncidencias = (data?.incidencias || []).filter((incidencia) =>
            rolName === RoleNames.valet
                ? incidencia.colaborador_reporta?.puesto?.nombre === "Valet parking"
                : rolName === RoleNames.roomService
                ? incidencia.colaborador_reporta?.puesto?.nombre === "Room service"
                : rolName === RoleNames.restaurante
                ? puestosRestaurante.includes(incidencia.colaborador_reporta?.puesto?.nombre ?? "")
                : true
        )

        if (dataIncidencias?.length > 0) {
            const activas = dataIncidencias?.filter((incidencia) => {
                return incidencia.estado === "activa"
            })
            const cerradas = dataIncidencias?.filter((incidencia) => {
                return incidencia.estado === "cerrada"
            })

            setIncidencias({
                activas: { list: activas, filters: {} },
                cerradas: { list: cerradas, filters: {} },
                todas: { list: dataIncidencias, filters: {} },
            })
            const data = type === "todas" ? dataIncidencias : type === "activa" ? activas : cerradas
            setRowsIncidencias(buildTable(data))

            setTabs([
                { label: "Todas las incidencias", path: "todas", number: dataIncidencias.length },
                { label: "Activas", path: "activa", number: activas.length },
                { label: "Cerradas", path: "cerrada", number: cerradas.length },
            ])
        }
    }, [type, hotel_id, data])

    const filterData = (search) => {
        setPage(1)
        //función para obtener los datos de la incidencia por filtro
        setSearchFolio(search)

        if (search) {
            const filterData = getIncidenciasByTab().filter(
                (incidencia: any) =>
                    //incidencia.folio.toString() === search ||
                    incidencia?.huesped?.toLowerCase().includes(search.toLowerCase()) ||
                    incidencia?.matricula?.toLowerCase().includes(search.toLowerCase()) ||
                    incidencia.detalle.toLowerCase().includes(search.toLowerCase())
            )

            if (filterData) {
                setRowsIncidencias(buildTable(filterData))
                setValueTabs(filterData)
            }
        } else {
            setRowsIncidencias(buildTable(getIncidenciasByTab()))
            setValueTabs(getIncidenciasByTab())
        }
    }

    const setValueTabs = (incidencias: any) => {
        if (type === "todas") tabs[0].number = incidencias.length
        else if (type === "activas") tabs[1].number = incidencias.length
        else if (type === "cerradas") tabs[2].number = incidencias.length
        setTabs([...tabs])
    }

    const handleClear = () => {
        //función para borrar el filtro de búsqueda
        setSearchFolio("")
        filterData("")

        if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.value = ""
            inputRef.current.dispatchEvent(new Event("change", { bubbles: true }))
        }
    }

    const getIncidenciasByTab = () => {
        //función para obtener los datos de la incidencia por tab
        const incidenciasFilter =
            type === "todas"
                ? incidencias.todas?.list
                : type === "activa"
                ? incidencias.activas?.list
                : incidencias.cerradas?.list

        return incidenciasFilter
    }

    const onTableLoad = () => {
        if (!tableRef.current || !location.state) {
            return
        }
        setType(location.state.estado === Estados_Incidencias.Activa ? "activa" : "cerrada")
        const filters: TableFilter[] = []
        if (location.state?.estado) {
            filters.push({ filter: location.state.estado, idx: 1, fromHeader: "Estatus" })
        }
        if (location.state?.subtipo_filter) {
            filters.push({
                filter: capitalizeString(location.state.subtipo_filter || "") || "",
                idx: 4,
                fromHeader: "Subtipo",
            })
        }
        tableRef.current?.setFiltersFromOuterState(filters)
    }

    useEffect(() => {
        if (!isDrawerOpen) {
            refetch({
                hotel_id,
                fecha_operacion: {
                    fecha_inicial: getDateFormat(
                        new Date(
                            UTCStringToLocalDate(currentDate?.serverDate).getFullYear(),
                            UTCStringToLocalDate(currentDate?.serverDate).getMonth(),
                            1
                        ),
                        true
                    ),
                    fecha_final: getDateFormat(new Date(currYear, Number(currMonth) + 1, 1), true),
                },
            })
        }
    }, [isDrawerOpen, currMonth, currYear])

    const handleFilter = (params: TableFilter[]) => {
        //función para filtrar las columnas de la tabla
        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const keyAll = params.filter(({ filter }) => filter === "todas")
        const clearParams =
            keyAll.length === 0 ? params : params.filter(({ idx }) => keyAll.find((item) => item.idx !== idx))
        if (clearParams.length > 0) {
            const results: any[] = []
            const estadoKeys = getKeys(1)
            const lugarKeys = getKeys(3)
            const tipoKeys = getKeys(4)
            const habitacionKeys = getKeys(5)
            const urgenciaKeys = getKeys(8)

            getIncidenciasByTab().forEach((item) => {
                if (
                    findValue(estadoKeys, item?.estado) &&
                    findValue(urgenciaKeys, item?.severidad) &&
                    findValue(lugarKeys, item?.area) &&
                    findValue(tipoKeys, item?.tipo_incidencia) &&
                    findValue(habitacionKeys, item?.habitacion?.numero_habitacion)
                ) {
                    results.push(item)
                }
            })
            setRowsIncidencias(buildTable(results))
        } else {
            setRowsIncidencias(buildTable(getIncidenciasByTab()))
        }
        setPage(1)
    }

    const [filters, setfilters] = useState<TableFilter[]>([])
    useEffect(() => {
        handleFilter(filters)
    }, [filters])

    useEscapeKey({
        onEscape: () => {
            navigate("/u")
        },
    })

    // Limpia el estado antes de la nueva carga (filtros por mes y año)
    useEffect(() => {
        setIncidencias({ activas: { list: [] }, cerradas: { list: [] }, todas: { list: [] } })

        refetch({
            hotel_id,
            fecha_operacion: {
                fecha_inicial: getDateFormat(new Date(currYear, Number(currMonth), 1), true),
                fecha_final: getDateFormat(new Date(currYear, Number(currMonth) + 1, 1), true),
            },
        })
    }, [currMonth, currYear])

    return (
        <Screen
            className="incidencias__screen"
            title={"Incidencias"}
            contentClassName="incidencias"
            close={true}
            onClose={() => navigate("/u")}
        >
            <section className="incidencias__container">
                <div className="incidencias__container-filters">
                    <TabMenu
                        className="incidencias__container-tabs"
                        tabList={tabs}
                        value={type}
                        onChange={(value) => {
                            setType(value)
                            setPage(1)
                            tableRef.current?.setFiltersFromOuterState([])
                        }}
                        showNumerOnNoItems={true}
                    />
                    <div className="incidencias__container-right">
                        {rolName !== RoleNames.monitoreo && (
                            <div className="incidencias__search">
                                <InputText
                                    ref={inputRef}
                                    icon={Icon}
                                    iconProps={{ name: "searchLg", color: "var(--primary)" }}
                                    className="incidencias__search__input"
                                    type={"text"}
                                    placeholder="Busca por huésped, matrícula o descripción"
                                    onChange={(e) => {
                                        filterData(e.target.value)
                                    }}
                                />
                                {searchFolio && (
                                    <div className="incidencias__search__close " onClick={handleClear}>
                                        <Icon name={"close"} color={"var(--primary)"} />
                                    </div>
                                )}
                            </div>
                        )}
                        <CalendarButtons
                            currMonth={currMonth}
                            setCurrMonth={setCurrMonth}
                            currYear={currYear}
                            setCurrYear={setCurrYear}
                            monthNames={monthNames}
                            className="ordenes__calendar-buttons"
                        />
                    </div>
                </div>
                {incidencias.todas?.list?.length > 0 ||
                incidencias.activas?.list?.length > 0 ||
                incidencias.cerradas?.list?.length > 0 ? (
                    <TablePaginatorWrapper
                        currentPage={page}
                        onChange={(p) => setPage(p)}
                        pages={Math.ceil(rowsIncidencias.length / rowsPerPage) || 1}
                    >
                        <div className={`incidencias__table${showGradient ? " show-gradient" : ""}`}>
                            {!loading ? (
                                <FlexibleTable
                                    onLoad={onTableLoad}
                                    ref={tableRef}
                                    onSelectedFilters={(f) => setfilters(f)}
                                    onHasScrollChange={setShowGradient}
                                    tableItems={{
                                        headers,
                                        rows: BuildRows(paginatedRows),
                                    }}
                                    goTo={(value) => {
                                        setIncidenciaSelected(value)
                                        toggleDrawerState(true)
                                    }}
                                    emptyState={
                                        searchFolio
                                            ? {
                                                headerIcon: "searchLg",
                                                titile: "Sin resultados",
                                                subTitle: `No hay resultados para **'${searchFolio}'**. Intenta de nuevo.`,
                                            }
                                            : type === "cerrada"
                                            ? {
                                                headerIcon: "docFill",
                                                titile: "No hay incidencias cerradas",
                                                subTitle: "Cuando cierres una incidencia, podrás visualizarla aquí",
                                            }
                                            : {
                                                headerIcon: "docFill",
                                                titile: "No hay incidencias reportadas",
                                                subTitle: "Comienza a registrar tus incidencias aquí",
                                            }
                                    }
                                />
                            ) : (
                                <TableSkeleton headers={headers} />
                            )}
                        </div>
                    </TablePaginatorWrapper>
                ) : (
                    <div className="incidencias__empty-state">
                        <EmptyState
                            headerIcon="docFill"
                            title="No hay incidencias reportadas"
                            subtitle="Comienza a registrar tus incidencias aquí"
                            containerClassName="incidencias__empty-state__container"
                        />
                    </div>
                )}
                {rolName !== RoleNames.monitoreo && (
                    <div
                        className="incidencias__float-button "
                        onClick={validateIsColabActive(() => {
                            navigate("/u/registro-incidencia")
                        })}
                    >
                        <Icon name="plus" color={"var(--white)"} />
                    </div>
                )}
            </section>
            {incidenciaSelected && (
                <DrawerSection
                    incidenciaId={incidenciaSelected}
                    visible={isDrawerOpen}
                    onClose={() => toggleDrawerState(false)}
                />
            )}
            {InactiveModal}
        </Screen>
    )
}

export default Incidencias
