import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import { useProfile } from "src/shared/hooks/useProfile"
import { selectDrawerSection, selectReservation } from "src/store/reservations/reservationsSlice"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import useSortTable from "src/shared/hooks/useSortTable"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { DrawerSection } from "../inicio/sections/Drawer/Drawer"
import { RootState } from "src/store/store"
import { v4 as uuid } from "uuid"
import cx from "classnames"
import Icon from "src/shared/icons"
import { getOrigenLabel } from "../helpers/origen"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import {
    EstadosReservas,
    EstadpPago,
    GetReservacionesTableQuery,
    useGetReservacionesTableQuery,
    useGetTiposHabitacionQuery,
} from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function ReservasDia() {
    const { date = "" } = useParams()
    const { hotel_id } = useProfile()
    const [dateHotel] = useCurrentDate()
    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const [reservasQuery, setReservasQuery] = useState<GetReservacionesTableQuery["reservas"]>([])
    const { setHHMMSS, UTCStringToLocalDate } = useDate()
    const headers = tableItems()
    const dispatch = useDispatch()
    const chosenDate = new Date(date)
    const startDate = new Date(chosenDate)
    const endDate = new Date(chosenDate)
    endDate.setDate(chosenDate.getDate() + 1)
    const { formatCustomDate } = useFormatDate()

    const [selectReserva, setSelectReserva] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)

    const toggleDrawerState = (value: boolean) => {
        dispatch(selectDrawerSection("detail"))
        dispatch(toggleDrawer(value))
    }

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

    const { data } = useGetReservacionesTableQuery({
        variables: {
            id: [],
            hotel_id,
            fecha_entrada: {
                fecha_inicial: startDate.toISOString().slice(0, 19),
                fecha_final: endDate.toISOString().slice(0, 19),
            },
        },
        fetchPolicy: "no-cache",
    })

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
    }, [onFilterTable, dataTables])

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

    useEffect(() => {
        setReservasQuery(data?.reservas || [])
    }, [data])

    useEffect(() => {
        const now = dateHotel
        setDataTables(
            reservasQuery.map((reserva) => ({
                goTo: reserva.reserva_id,
                value: [
                    { value: `ER-${reserva.folio.toString().padStart(3, "0")}` },
                    {
                        value: formatTableStateAsignacion({
                            idHabitacion: reserva.habitacion_id || "",
                            numHabitacion: reserva.habitacion.numero_habitacion || "",
                        }),
                        fromHeaderSort: headers[0].value,
                        sortValue: reserva.habitacion.numero_habitacion || "",
                    },
                    { value: reserva?.origen ? getOrigenLabel(reserva?.origen) : "" },
                    { value: reserva.tipo_de_habitacion?.nombre || "" },
                    { value: reserva.nombre_huesped },
                    {
                        value: `${formatCustomDate(
                            UTCStringToLocalDate(reserva.fecha_entrada),
                            "DD/MMM/YY"
                        )} - ${formatCustomDate(UTCStringToLocalDate(reserva.fecha_salida), "DD/MMM/YY")}`,
                        fromHeaderSort: headers[4].value,
                        sortValue: reserva.fecha_entrada,
                    },
                    { value: `${reserva.tarifa?.nombre} - ${formatCurrency(reserva.tarifa?.costo_habitacion || 0)}` },
                    {
                        value: formatTableState({
                            statePago: reserva.estado_pago,
                            fechaCancel: reserva.fecha_cancelacion || "",
                            isNoShow:
                                reserva.estado !== EstadosReservas.CheckIn &&
                                now.getTime() >
                                    setHHMMSS({
                                        startDate: UTCStringToLocalDate(reserva.fecha_salida),
                                        newHour: reserva?.tarifa?.hora_checkout || "",
                                    }).getTime() +
                                        60 * 1000,
                        }),
                    },
                ],
            }))
        )
    }, [reservasQuery, data])

    const diaActual = () => {
        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ]
        const month = monthNames[chosenDate.getMonth()]
        const day = chosenDate.getDate()
        const year = chosenDate.getFullYear()
        const formattedDate = `${day} ${month},  ${year}`
        return formattedDate
    }

    useEffect(() => {
        if (dataTable.length > 0) {
            setLoading(false)
        }
    }, [dataTable])

    return (
        <Screen title={"Reservas - " + diaActual()} contentClassName="reservas-screen" close>
            <div className="reservas-screen__table-wrapper" style={{ marginTop: 30, height: "calc(100dvh - 180px)" }}>
                {!loading ? (
                    <FlexibleTable
                        tabIndex={0}
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
                ) : (
                    <TableSkeleton headers={headers} />
                )}
            </div>
            <DrawerSection visible={isDrawerOpen} id={selectReserva} onClose={() => toggleDrawerState(false)} />
        </Screen>
    )
}

export default ReservasDia

const tableItems = () => {
    const { hotel_id } = useProfile()
    const { data } = useGetTiposHabitacionQuery({
        variables: { hotel_id: hotel_id },
    })

    // Definir una variable para almacenar los tipos de habitación

    const [tiposTipe, settiposTipe] = useState<{ value: string; valueToDisplay: string }[]>([])

    useEffect(() => {
        if (data && data.tipo_habitaciones) {
            // Mapear los tipos de habitación desde la respuesta GraphQL
            settiposTipe(
                data.tipo_habitaciones.map((value) => ({
                    value: value.nombre || "",
                    valueToDisplay: value.nombre || "",
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
                value: "Código Easyroom",
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

    return (
        <div className="reservas-screen__table-cell__pago">
            <div
                key={uuid()}
                className={cx({
                    "reservas-screen__table-cell__pago-text": true,
                    "reservas-screen__table-cell--pendiente": pendiente,
                    "reservas-screen__table-cell--pagada": statePago === EstadpPago.Pagado,
                    "reservas-screeen__table-cell--no-show": isNoShow,
                    "reservas-screen__table-cell--cancelada": fechaCancelExists,
                })}
            >
                {fechaCancelExists
                    ? "Cancelada"
                    : isNoShow
                    ? "No show"
                    : pendiente
                    ? "Pendiente"
                    : statePago === EstadpPago.Pagado
                    ? "Pagada"
                    : ""}
            </div>
        </div>
    )
}
