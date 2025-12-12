import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setMovimientos } from "src/store/cortes/cortesSlice"
import { useDispatch, useSelector } from "react-redux"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import CardsSkeleton from "./../Components/CardsSkeleton/CardsSkeleton"
import Empty from "src/shared/components/data-display/empty/Empty"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { Cards } from "./sections/Cards"
import { CellConcept, CellPrint } from "./sections/Cells"
import Fajilla from "./sections/Fajilla"
import Clock from "./sections/Clock"
import History from "./sections/History"
import { useMovimientosParams, getDateFormat } from "./hooks/useMovimientosParams"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { getDateStringMDY } from "src/utils/date"
import { useHeader, useRows } from "./hooks/useTable"
import { useFetch } from "../../../shared/hooks/useFetch"
import "./../CortesScreen.css"
import "./Cortes.css"
import { Button } from "src/shared/components/forms"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { MovimientosCorte } from "./interfaces/MovimientosCorte"
import { ResumenPagos } from "../Sections/ResumenTurno/interfaces/resumenPagos"
import { RootState } from "src/store/store"
import { CancellationDetails } from "./sections/Drawer"
import Icon from "src/shared/icons"
import { useCurrentDateLazyQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import EditarMetodoPago from "../Components/Modals/EditarMetodoPago/EditarMetodoPago"
import NavigatorButton, { NavigatorButtonRef } from "./sections/NavigatorButton"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import ModalCancelacion from "../Components/Modals/Cancelacion/Cancelacion"

type CortesProps = {
    isDetail?: boolean
}

// Si la pantalla está vacía de cortes y no está el botón de nuevo corte revisar que se esté en el turno correcto
const Cortes = ({ isDetail = false }: CortesProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [getCurrentDate] = useCurrentDateLazyQuery()
    const { UTCStringToLocalDate } = useDate()

    const rol = useCurrentRol()
    const { hotel_id } = useProfile()
    const {
        turno_id,
        fecha_inicio,
        fecha_fin,
        nombre,
        usuario_id,
        date,
        ultimo_corte,
        params,
        loading,
        corte_pendiente,
    } = useMovimientosParams()
    const [open, setOpen] = useState<any>({ state: false, data: "" })
    const [movimiento, setMovimiento] = useState<any>(null)
    const [cancelacion, setCancelacion] = useState<any>(null)

    const { movimientos: movimientosState } = useSelector((state: RootState) => state.cortes)
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const [showGradient, setShowGradient] = useState(false)

    const {
        data: movimientos,
        load,
        refetch: refetchMovimientos,
    } = useFetch<MovimientosCorte>("/cortes/movimientosCorte", {
        defaultValue: [],
        startFetch: false,
    })

    const { data: dashboard, refetch: refetchDashboard } = useFetch<ResumenPagos>("/cortes/resumen_pagos", {
        defaultValue: null,
        startFetch: false,
    })

    const handleRefetch = () => {
        const fechas = {
            fecha_inicio,
            fecha_fin,
        }
        const variables = {
            usuario_id,
            turno_id,
            hotel_id,
            ...(fecha_inicio ? { ...fechas } : {}),
        }
        refetchMovimientos(variables)
        refetchDashboard(variables)
    }

    useEffect(() => {
        if (turno_id && !loading) {
            handleRefetch()
        }
    }, [turno_id, fecha_inicio, loading])

    useEffect(() => {
        if (movimientos) {
            dispatch(
                setMovimientos([
                    ...(movimientos?.anticipos_reservas || []),
                    ...(movimientos?.anticipos_reservas_cancelados || []),
                    ...(movimientos?.extras || []),
                    ...(movimientos?.extras_cancelados || []),
                    ...(movimientos?.gastos || []),
                    ...(movimientos?.gastos_cancelados || []),
                    ...(movimientos?.habitaciones || []),
                    ...(movimientos?.habitaciones_canceladas || []),
                    ...(movimientos?.propinas?.estancia || []),
                    ...(movimientos?.propinas?.otros || []),
                    ...(movimientos?.propinas?.roomservice || []),
                    ...(movimientos?.roomservice || []),
                    ...(movimientos?.roomservice_cancelados || []),
                    ...(movimientos?.saldos_reservas || []),
                    ...(movimientos?.saldos_reservas_cancelados || []),
                ])
            )
        }
    }, [movimientos])

    const [categoriasFiltro, setCategoriasFiltro] = useState<string[] | null>(null)
    const headers = useHeader(movimientosState, categoriasFiltro ?? undefined)
    const { rows, handleSort, handleFilter } = useRows(movimientosState)

    const handleFilterCategoria = (params: any[]) => {
        const categoriasSeleccionadas = params
            .filter((p) => p.idx === 1)
            .map((p) => p.filter)
            .flat()
            .filter(Boolean)
        const categorias =
            categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes("todos")
                ? null
                : categoriasSeleccionadas

        setCategoriasFiltro(categorias)
        handleFilter(params)
    }

    const handleClose = () => navigate(isDetail ? "/u/cortes" : "/u", { replace: true })

    const onRefetch = () => {
        getCurrentDate().then((d) => {
            const date = UTCStringToLocalDate(d.data?.serverDate)

            date.setMinutes(date.getMinutes() + 1)
            const variables = {
                fecha_inicio,
                fecha_fin: getDateFormat(date, true),
                usuario_id,
                turno_id,
                hotel_id,
            }
            refetchDashboard(variables)
            refetchMovimientos(variables)
        })
    }

    const [isModalFajillaOpen, setisModalFajillaOpen] = useState<boolean>(false)

    useEscapeKey({
        onEscape: () => {
            if (isModalFajillaOpen) {
                return setisModalFajillaOpen(false)
            }
            navigate("/u")
        },
    })

    const navigatorButtonRef = useRef<NavigatorButtonRef>(null)

    return (
        <Screen
            title={isDetail ? "Saldos y movimientos" : "Cortes"}
            close={true}
            back={isDetail}
            className={`cortes-screen-l cortes-screen${isDetail ? " cortes-screen-detail" : ""}`}
            contentClassName="cortes-screen__content"
            onClose={handleClose}
            onBack={isDetail ? () => navigate(-1) : undefined}
            headerRight={
                !isDetail ? (
                    <div className="cortes-screen__header">
                        {rol !== RoleNames.recepcionista ? <Clock /> : null}
                        {rol !== RoleNames.recepcionista ? <History /> : null}
                        {rol === RoleNames.recepcionista && (
                            <Button
                                className="cortes-screen__header-button"
                                theme="secondary"
                                text="Cortes recientes"
                                icon="Clock"
                                onClick={() => navigate("/u/cortes/historial-cortes")} //ir a historial
                            />
                        )}
                        {movimientosState?.length > 0 && (
                            <Fajilla
                                fajillas={dashboard?.dashboard?.cantidad_fajillas}
                                limitAmount={dashboard?.efectivo_disponible_recepcion || 0}
                                onEvent={onRefetch}
                                isOpen={isModalFajillaOpen}
                                toggleModal={validateIsColabActive((value) => setisModalFajillaOpen(value))}
                            />
                        )}
                    </div>
                ) : (
                    <div className="cortes-screen__header-space"></div>
                )
            }
        >
            {!load ? (
                <div className="cortes-screen__container">
                    <div className="cortes-screen__subtitle">
                        <p className="cortes-screen__subtitle-turno">{`Turno ${nombre.toLowerCase()}:`}</p>
                        <p className="cortes-screen__subtitle-date">{getDateStringMDY(date)}</p>
                    </div>
                    {movimientosState?.length === 0 ? (
                        <Empty
                            className="cortes-screen__empty"
                            icon="dollarCircle"
                            title={ultimo_corte ? "Aún no hay movimientos en tu turno" : "Sin cortes"}
                            description={
                                ultimo_corte
                                    ? "Puedes cerrar corte aunque no tengas movimientos registrados. Esto te ayudará a mantener el control de tus turnos."
                                    : "Cuando el hotel comience a operar, podrás consultar en esta sección tus ingresos y egresos"
                            }
                            button={
                                <NavigatorButton ref={navigatorButtonRef}>
                                    <Button
                                        text="Cerrar corte"
                                        style={{ width: "412px" }}
                                        onClick={() => navigatorButtonRef.current?.onConfirm()}
                                    />
                                </NavigatorButton>
                            }
                        />
                    ) : (
                        <div className="cortes-screen__container__data">
                            <Cards
                                data={dashboard?.dashboard}
                                onLinkFajillas={() =>
                                    navigate("/u/cortes/fajillas", {
                                        state: isDetail ? params : {},
                                    })
                                }
                            />

                            <div
                                className={`cortes-screen__table-mov animante__opacity ${
                                    isDetail ? "cortes-screen-detail__table" : "cortes-screen__table-lg"
                                }${showGradient ? " cortes-screen__table-mov--show-gradient" : ""}`}
                            >
                                <FlexibleTable
                                    onSelectedFilters={handleFilterCategoria}
                                    onSort={handleSort}
                                    onHasScrollChange={setShowGradient}
                                    tableItems={{
                                        ...{
                                            headers,
                                            rows: rows.map((row) => ({
                                                goTo: row?.goTo,
                                                value: row.value.map(({ value }, index, arr) => ({
                                                    // la última columna es la que va a tener este estilo
                                                    value:
                                                        index === arr.length - 1 ? (
                                                            <div className="cortes-screen-detail__table__ticket">
                                                                {value?.cancelacion ? (
                                                                    <Icon
                                                                        style={{ cursor: "pointer" }}
                                                                        name="eye"
                                                                        color="var(--primary)"
                                                                        height={"20px"}
                                                                        width={"20px"}
                                                                        onClick={() =>
                                                                            setOpen({
                                                                                state: true,
                                                                                data: value?.ticket_id,
                                                                            })
                                                                        }
                                                                    />
                                                                ) : corte_pendiente ? (
                                                                    <>
                                                                        {value?.editar && (
                                                                            <div
                                                                                className="reservas-screen__table-cell__pago cursor"
                                                                                style={{ marginLeft: 0 }}
                                                                                onClick={() => setMovimiento(value)}
                                                                            >
                                                                                <Icon
                                                                                    name="editFill"
                                                                                    color="var(--primary)"
                                                                                    height={"20px"}
                                                                                    width={"20px"}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {value?.cancelar && (
                                                                            <div
                                                                                className="reservas-screen__table-cell__pago cursor"
                                                                                onClick={() => setCancelacion(value)}
                                                                            >
                                                                                <Icon
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                        minWidth: 20,
                                                                                    }}
                                                                                    name="trashFilled"
                                                                                    color="var(--primary)"
                                                                                    height={20}
                                                                                    width={20}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <div />
                                                                )}
                                                                <CellPrint ticketId={value?.ticket_id} />
                                                            </div>
                                                        ) : index === 1 || index === 2 ? (
                                                            <CellConcept text={value} isCategoria={index === 1} />
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
                                    goTo={(id) => {
                                        if (id) setOpen({ state: true, data: id })
                                    }}
                                ></FlexibleTable>
                            </div>
                        </div>
                    )}
                    {!isDetail && movimientosState.length > 0 ? (
                        <NavigatorButton ref={navigatorButtonRef}>
                            <FloatButon
                                className="cortes-screen__float-btn"
                                icon="currencyFill"
                                onAdd={() => navigatorButtonRef.current?.onConfirm()}
                            />
                        </NavigatorButton>
                    ) : null}
                </div>
            ) : (
                <div>
                    <Skeleton elements={1} className="cortes-screen__header-skeleton" />
                    {rol !== RoleNames.recepcionista && <CardsSkeleton />}
                    <div
                        className={`cortes-screen__table-mov animante__opacity ${
                            isDetail
                                ? "cortes-screen-detail__table"
                                : `cortes-screen__table-${rol !== RoleNames.recepcionista ? "lg" : "sm"}`
                        }`}
                    >
                        <TableSkeleton headers={headers} />
                    </div>
                </div>
            )}
            {open.state && (
                <CancellationDetails
                    isOpen={true}
                    onClose={() => {
                        setOpen({ state: false, data: "" })
                    }}
                    ticketId={open.data}
                />
            )}
            {InactiveModal}
            {movimiento && (
                <EditarMetodoPago
                    movimiento={movimiento}
                    onClose={() => setMovimiento(null)}
                    onSuccess={handleRefetch}
                />
            )}
            {cancelacion && (
                <ModalCancelacion
                    movimiento={cancelacion}
                    onClose={() => setCancelacion(null)}
                    onSuccess={isDetail ? () => handleRefetch() : () => onRefetch()}
                />
            )}
        </Screen>
    )
}

export default Cortes
