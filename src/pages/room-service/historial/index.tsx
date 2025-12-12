import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import FlexibleTable, { TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import Status from "./components/cell/Status"
import { getShortDateFormatted } from "src/utils/date"
import { useHeader } from "./hooks/useHeader"
import { useModulos } from "src/shared/hooks/useModulos"
import "./HistorialRS.css"
import useGetOrdenes from "./hooks/useGetOrdenes"
import { Mesa, TipoOrden, useGetNumeroMesasQuery } from "src/gql/schema"
import useGetComandas from "./hooks/useGetComandas"
import { formatRestaurantRows, formatRoomServiceMostradorRows } from "./helpers/formatRows"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import useCountHistorial from "./hooks/useCountHistorial"
import { useProfile } from "src/shared/hooks/useProfile"
import Search, { SearchRef } from "./components/search/Search"
import Icon from "src/shared/icons"
import InputDateModalDeselectable from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModalDeselectable"
import useGetCurrentDate from "src/shared/hooks/useGetCurrentDate"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function HistorialRS(): JSX.Element {
    const { restaurante } = useModulos()
    const [type, setType] = useState<TipoOrden>(TipoOrden.RoomService)
    const [date, setDate] = useState<Date>(new Date())
    const [page, setpage] = useState(1)
    const { hotel_id } = useProfile()
    const searchRef = useRef<SearchRef>(null)
    const [numeroOrdenFilter, setnumeroOrdenFilter] = useState("")
    const [filterMesa, setfilterMesa] = useState<string | null>(null)
    const { data: mesas } = useGetNumeroMesasQuery({ variables: { hotel_id } })
    const { headers, headersRestaurant } = useHeader((mesas?.mesas as Mesa[]) || [])
    const { formatCustomDate } = useFormatDate()


    const { skeletonRows } = tableSkeletonRows({
        headers: type === TipoOrden.Restaurante ? headersRestaurant : headers,
    })

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [openDateModal, setOpenDateModal] = useState(false)
    const { currentDate } = useGetCurrentDate()
    const dateHotel = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    const navigate = useNavigate()
    const { countComandas, countOrdenesMostrador, countOrdenesRoomService } = useCountHistorial({
        dateFilter: date,
    })

    const {
        isLoading: isOrdenesLoading,
        ordenes,
        ordenesPages,
    } = useGetOrdenes({
        dateFilter: date,
        disabled: type === TipoOrden.Restaurante,
        numeroOrdenFilter,
        origenFilter: type,
        page,
    })

    const {
        comandas,
        comandasPages,
        isLoading: isComandasLoading,
    } = useGetComandas({
        dateFilter: date,
        disabled: type !== TipoOrden.Restaurante,
        numeroOrdenFilter,
        numeroMesa: filterMesa,
        page,
    })

    const totalRows = type === TipoOrden.Restaurante ? comandas.length : ordenes.length
    const showPaginator = totalRows > 20

    const handleFilter = (f: TableFilter[]) => {
        if (!f.length || !f) {
            setfilterMesa(null)
            return
        }
        setfilterMesa(f[0].filter)
    }

    const handleSearch = (value: string) => {
        setnumeroOrdenFilter(value)
        setpage(1)
    }

    const openInputDateModalDeselectable = () => {
        setSelectedDate(date)
        setOpenDateModal(true)
    }

    const confirmDate = () => {
        if (selectedDate) {
            setDate(selectedDate)
        }
        setOpenDateModal(false)
    }

    const resetDate = () => {
        setSelectedDate(null)
        setDate(new Date())
        setOpenDateModal(false)
    }

    const [showGradient, setShowGradient] = useState(false);

    return (
        <Screen
            title={"Historial de movimientos"}
            subtitle={date ? getShortDateFormatted(date) : ""}
            className="ordenes__screen"
            contentClassName="ordenes"
            back={true}
            onBack={() => {
                navigate(-1)
            }}
            headerRight={
                <div className="ordenes__search">
                    <Search ref={searchRef} onChange={(e) => handleSearch(e)} />
                    <button
                        onClick={openInputDateModalDeselectable}
                        className={`historial__icon-calendar ${selectedDate ? "historial__icon-calendar--active" : ""}`}
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
                        onChange={(dateSelected) => {
                            if (!dateSelected || (Array.isArray(dateSelected) && dateSelected.length === 0)) {
                                return
                            }
                            const selected = Array.isArray(dateSelected) ? dateSelected[0] : dateSelected
                            setSelectedDate(selected)
                        }}
                        onReset={resetDate}
                        onConfirm={confirmDate}
                        modalClosableOnClickOutside={true}
                        disabledAfterOrEqualDate={
                            new Date(dateHotel.getFullYear(), dateHotel.getMonth(), dateHotel.getDate() + 1)
                        }
                        maxDate={date === dateHotel ? date : dateHotel}
                        allowDateDeselect={true}
                    />
                </div>
            }
        >
            <section className="ordenes__container">
                <div className="ordenes__container-filters">
                    <TabMenu
                        className="ordenes__container-tabs"
                        tabList={[
                            { label: "Room service", number: countOrdenesRoomService, path: TipoOrden.RoomService },
                            { label: "Mostrador", number: countOrdenesMostrador, path: TipoOrden.Mostrador },
                            ...(restaurante
                                ? [{ label: "Restaurante", number: countComandas, path: TipoOrden.Restaurante }]
                                : []),
                        ]}
                        value={type}
                        onChange={(value) => {
                            setType(value as TipoOrden)
                            searchRef.current?.setSearch("")
                            setpage(1)
                        }}
                        showNumerOnNoItems={true}
                    />
                </div>
                <TablePaginatorWrapper
                    pages={
                        showPaginator ? (type === TipoOrden.Restaurante ? comandasPages || 1 : ordenesPages || 1) : 0
                    }
                    currentPage={page}
                    onChange={(p) => setpage(p)}
                >
                    <div className="historial-rs__table">
                        <div className={`historial-rs__table-container${showGradient ? " historial-rs__table-container--show-gradient" : ""}`}>
                            <FlexibleTable
                                onSelectedFilters={handleFilter}
                                onHasScrollChange={setShowGradient}
                                tableItems={{
                                    ...{
                                        headers: type === TipoOrden.Restaurante ? headersRestaurant : headers,
                                        rows:
                                            isComandasLoading || isOrdenesLoading
                                                ? skeletonRows
                                                : (type === TipoOrden.Restaurante
                                                    ? formatRestaurantRows(comandas, formatCustomDate)
                                                    : formatRoomServiceMostradorRows(ordenes, formatCustomDate)
                                                )?.map((row) => ({
                                                    value: row?.value?.map(({ value }, index) => ({
                                                        value:
                                                            index === 10 ? (
                                                                <Status
                                                                    statusOrden={value?.estado_orden}
                                                                    statusOrdenPago={value?.estado_pago}
                                                                />
                                                            ) : index === (type === TipoOrden.Restaurante ? 7 : 6) ? (
                                                                value
                                                            ) : index === (type === TipoOrden.Restaurante ? 8 : 7) ? (
                                                                value
                                                            ) : index ===
                                                                (type !== TipoOrden.Restaurante ? 8 : "") ? (
                                                                value
                                                            ) : index === 9 ? (
                                                                value
                                                            ) : (
                                                                value
                                                            ),
                                                    })),
                                                })) || [],
                                    },
                                }}
                                emptyState={{
                                    titile: "No tienes órdenes registradas",
                                    headerIcon: "dollarCircle",
                                }}
                            />
                        </div>
                    </div>
                </TablePaginatorWrapper>
            </section>
        </Screen>
    )
}

export default HistorialRS
