import React, { useEffect, useMemo, useState } from "react"
import { useRoom } from "src/pages/home/room-detail/hooks"
import LockRoom from "src/pages/home/room-detail/Modals/LockRoom/LockRoom"
import ReportIncidence from "src/pages/home/room-detail/Modals/ReportIncidence/ReportIncidence"
import DrawerWrapper from "src/pages/home/room-detail/sections/DrawerWrapper"
import { HomeView } from "src/pages/home/room-detail/sections/views/Views"
import { OccupiedDetailSection } from ".."
import { Block, Tabs } from "../../../sections/elements/Elements"

import "./Home.css"

import Huesped from "./tabs/huesped/Huesped"
import Payments from "./tabs/payments/Payments"
import RoomService from "./tabs/roomService/RoomService"
import CambioHabitacion from "./tabs/CambioHabitacion/CambioHabitacion"
import TipoLimpieza from "../../general/sections/TipoLimpieza"
import { addTimeByCleaningType } from "src/shared/helpers/addTimeByCleaningType"
import AvatarProgressCard from "src/shared/components/data-display/AvatarProgressCard/AvatarProgressCard"
import { useDate } from "src/shared/hooks/useDate"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import ActiveCleanStaff from "./ActiveCleanStaff/ActiveCleanStaff"
import SwapStaff from "../../limpieza/sections/CleanStaff"
import CleanStaff from "../../general/sections/CleanStaff"
import ChangeCleanType from "../../general/sections/ChangeCleanType/ChangeCleanType"
import { useDispatch, useSelector } from "react-redux"
import { startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import { selectRoom } from "src/store/rooms/roomsSlice"
import { useNavigate } from "react-router-dom"
import { ModalConfirm } from "src/shared/components/layout"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import CancelarRenta from "../../../Modals/CancelarRenta/CancelarRenta"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"
import { selectSelectedInitialTab } from "src/store/roomDetails/ocupadaSlice"
import Comments from "./tabs/comments/Comments"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

type tabsPaths =
    | "huesped"
    | "room_service"
    | "payments"
    | "comments"
    | "cleanRoom"
    | "cambioHabitacion"
    | "tipoLimpieza"
    | "active-cleaning-staff"
    | "swap-colaborador"
    | "cambio-tipo-limpieza"

export const homeTabsList: { label: string; path: tabsPaths; number: number }[] = [
    { label: "Huésped", path: "huesped", number: 0 },
    { label: "Room Service", path: "room_service", number: 0 },
    { label: "Pagos", path: "payments", number: 0 },
    { label: "Comentarios", path: "comments", number: 0 },
]

const Home = ({ onChangeSection }: { onChangeSection: (section: OccupiedDetailSection) => void }) => {
    const room = useRoom()
    const { rolName } = useProfile()
    const [type, setType] = useState<tabsPaths>("huesped")
    const dispatch = useDispatch()
    const { drawerSelectedInitialTab } = useSelector((state: RootState) => state.roomDetails.ocupada)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    useEffect(() => {
        if (drawerSelectedInitialTab) {
            setType(drawerSelectedInitialTab)
            dispatch(selectSelectedInitialTab(null))
        }
    }, [drawerSelectedInitialTab])

    const navigate = useNavigate()

    const [isModalPendingPaymentsOpen, setisModalPendingPaymentsOpen] = useState(false)

    const { UTCStringToLocalDate, formatDateWithTime } = useDate()

    const [isLockRoomModalOpen, setIsLockRoomModalOpen] = useState(false)
    const [isReportIncidenceModalOpen, setIsReportIncidenceModalOpen] = useState(false)
    const [isCancelarRentaModalOpen, setIsCancelarRentaModalOpen] = useState(false)

    const [camaristaSelected, setcamaristaSelected] = useState<{ nombre: string; colaborador_id: string }[]>([
        {
            nombre: "",
            colaborador_id: "",
        },
    ])

    const [isCancelarReservaLoading] = useState(false)

    const totalOrdenesPendientes = Number(room?.ultima_renta?.saldo_pendiente_ordenes || 0)

    const visibleTabs = useMemo(() => {
        return homeTabsList.filter(
            (tab) => rolName !== "MANTENIMIENTO" || (tab.path !== "room_service" && tab.path !== "payments")
        )
    }, [rolName])

    const ItemsOccupiedOptions = (status: string) => [
        {
            label: "Reportar incidencia",
            onClick: validateIsColabActive(() => {
                setIsReportIncidenceModalOpen(true)
            }),
        },
        ...(room?.colaborador_tareas_sin_finalizar?.length
            ? []
            : [
                {
                    label: "Cambio de habitación",
                    onClick: validateIsColabActive(() => {
                        setType("cambioHabitacion")
                    }),
                },
                {
                    label: "Cancelaciones",
                    disabled: !room?.ultima_renta?.es_renta_cancelable && !room?.ultima_renta?.tiene_ventas_cancelables,
                    onClick: validateIsColabActive(() => {
                        setIsCancelarRentaModalOpen(true)
                    }),
                },
            ]),
    ]
    
    return (
        <DrawerWrapper
            withMenu={
                rolName !== "MANTENIMIENTO" &&
                (type === "huesped" || type === "room_service" || type === "payments" || type === "comments")
            }
            itemsMenu={rolName === "MANTENIMIENTO" ? undefined : ItemsOccupiedOptions(room?.status)}
            withBackButton={
                type === "cleanRoom" ||
                type === "cambioHabitacion" ||
                type === "tipoLimpieza" ||
                type === "active-cleaning-staff" ||
                type === "swap-colaborador" ||
                type === "cambio-tipo-limpieza"
            }
            onBack={() => {
                if (type === "swap-colaborador") {
                    setType("huesped")
                    return
                }
                if (type === "tipoLimpieza") {
                    return setType("cleanRoom")
                }
                setType("huesped")
            }}
        >
            {type === "active-cleaning-staff" ? (
                <ActiveCleanStaff onSwapColaborador={() => setType("swap-colaborador")} />
            ) : type === "swap-colaborador" ? (
                <SwapStaff onNavigate={() => setType("huesped")} />
            ) : type === "cleanRoom" ? (
                <CleanStaff
                    onNavigate={() => 1}
                    onConfirmItem={({ state, colaboradores }) => {
                        setType(state as tabsPaths)
                        setcamaristaSelected(colaboradores)
                    }}
                />
            ) : type === "cambioHabitacion" ? (
                <CambioHabitacion />
            ) : type === "tipoLimpieza" ? (
                <TipoLimpieza
                    colaboradorNombre={camaristaSelected?.[0].nombre}
                    colaborador_ids={camaristaSelected?.map((c) => c.colaborador_id)}
                    onConfirm={() => setType("huesped")}
                />
            ) : type === "cambio-tipo-limpieza" ? (
                <ChangeCleanType
                    onConfirm={() => {
                        setType("huesped")
                        dispatch(
                            startGetSelectedRoom(room?.habitacion_id, false, () => {
                                dispatch(selectRoom({}))
                            })
                        )
                    }}
                />
            ) : (
                <HomeView title={`${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`}>
                    <div className="room-detail--occupied__container">
                        <Block>
                            <div>
                                {!room?.colaborador_tareas_sin_finalizar?.length ? (
                                    <AvatarProgressCard
                                        progressbarDescriprionBottom={`Entrada: ${formatDateWithTime(
                                            UTCStringToLocalDate(room?.ultima_renta?.fecha_registro)
                                        )}`}
                                        timeLimit={UTCStringToLocalDate(room?.ultima_renta?.fecha_condensada)}
                                        timeStart={UTCStringToLocalDate(room?.ultima_renta?.fecha_registro)}
                                        daysLabel={"noche"}
                                    />
                                ) : (
                                    <AvatarProgressCard
                                        avatarSrcs={room?.colaborador_tareas_sin_finalizar?.map(
                                            (t) => t?.colaborador?.foto
                                        )}
                                        onClickDescriptionLink={() => setType("active-cleaning-staff")}
                                        progressbarDescriprionBottom={`Entrada: ${formatDateWithTime(
                                            UTCStringToLocalDate(room?.ultima_renta?.fecha_registro)
                                        )}`}
                                        avatarName={`${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.nombre} ${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.apellido_paterno} ${room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.apellido_materno}`}
                                        timeLimit={UTCStringToLocalDate(
                                            addTimeByCleaningType({
                                                date: room?.colaborador_tareas_sin_finalizar?.[0]?.fecha_inicio,
                                                cleaningType:
                                                    room?.colaborador_tareas_sin_finalizar?.[0]?.tipo_limpieza,
                                                tiempoLimpiezaDetallada:
                                                    room?.tipo_habitacion?.minutos_limpieza_detallada,
                                                tiempoLimpiezaNormal: room?.tipo_habitacion?.minutos_limpieza_normal,
                                                tiempoLimpiezaRetoque: room?.tipo_habitacion?.minutos_limpieza_retoque,
                                            })
                                        )}
                                        timeStart={UTCStringToLocalDate(
                                            room?.colaborador_tareas_sin_finalizar?.[0]?.fecha_inicio
                                        )}
                                    />
                                )}
                            </div>
                            <Tabs
                                value={type}
                                onChange={(value) => setType(value as tabsPaths)}
                                tabList={visibleTabs}
                                className="room-detail--occupied__tabs"
                            />
                            {type === "huesped" ? (
                                <Huesped
                                    onClean={() => setType("cleanRoom")}
                                    onSwapColaborador={() => setType("swap-colaborador")}
                                    onSwapTipoLimpieza={() => setType("cambio-tipo-limpieza")}
                                />
                            ) : type === "room_service" ? (
                                <RoomService />
                            ) : type === "payments" ? (
                                <Payments />
                            ) : (
                                <Comments />
                            )}
                        </Block>
                    </div>
                </HomeView>
            )}
            <LockRoom isOpen={isLockRoomModalOpen} onClose={() => setIsLockRoomModalOpen(false)} />
            <ReportIncidence isOpen={isReportIncidenceModalOpen} onClose={() => setIsReportIncidenceModalOpen(false)} />
            <ModalConfirm
                icon={
                    <IconBorder primaryBgDiameter={24} primaryBgColor="var(--pink-ocupado)">
                        <Icon
                            name="IconPendingPayment"
                            color="var(--white)"
                            height={14}
                            width={14}
                            secondarycolor="var(--pink-ocupado)"
                        />
                    </IconBorder>
                }
                cancelButtonText="Aceptar"
                iconTheme="danger"
                title="Pagos pendientes"
                confirmLabel="Ver pendientes"
                isOpen={isModalPendingPaymentsOpen}
                description={
                    <BoldedText color="var(--placeholder)">
                        {`No se puede cancelar la **${
                            room.nombre
                        }** porque tiene un pago pendiente de **${formatCurrency(
                            totalOrdenesPendientes
                        )}** de Room service. Para cancelar la habitación, cancela o paga la orden pendiente de Room service.`}
                    </BoldedText>
                }
                onCloseDialog={({ confirmed }) => {
                    setisModalPendingPaymentsOpen(false)
                    if (!confirmed) {
                        return
                    }
                    navigate(`/u/room-service/pago/${room.ultima_renta.renta_id}`, {
                        state: { origen: "ModalPendiente", habitacionId: room.habitacion_id },
                    })
                }}
            />
            {isCancelarRentaModalOpen && <CancelarRenta
                isOpen={true}
                onClose={() => {
                    setIsCancelarRentaModalOpen(false)
                }}
                onConfirm={(v) => {
                    if (!v) {
                        dispatch(toggleRoomDetailsDrawer(false))
                        return
                    }
                    navigate(`/u/cancelar-habitacion/${room?.habitacion_id}`, {
                        state: {
                            motivoCancelacion: v.descriptionMotivo || v.motivoCancelacion,
                            extras: v.extras,
                            renta_id: room?.ultima_renta?.renta_id,
                            codigo: v.codigoVerificacion,
                            cancelar_estancia: v.cancelar_estancia,
                            ordenes: v.ordenes
                        },
                    })
                }}
            />}
            <LoaderComponent visible={isCancelarReservaLoading} />
            {InactiveModal}
        </DrawerWrapper>
    )
}

export default Home
