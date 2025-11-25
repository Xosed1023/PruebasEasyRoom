import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRoom } from "src/pages/home/room-detail/hooks"
import LockRoom from "src/pages/home/room-detail/Modals/LockRoom/LockRoom"
import ReportIncidence from "src/pages/home/room-detail/Modals/ReportIncidence/ReportIncidence"
import DrawerWrapper from "src/pages/home/room-detail/sections/DrawerWrapper"
import { HomeView } from "src/pages/home/room-detail/sections/views/Views"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { formatDate } from "src/shared/helpers/formatDate"
import { CleanDetailSection } from "../.."
import { Block, PrimaryButton } from "../../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import "./Home.css"
import { useCleaningTypes } from "src/pages/home/room-detail/hooks/limpieza"
import { ItemTimer } from "src/pages/home/room-detail/sections/items/Items"
import { useDisponibilidadHabitacion } from "../../../venta/hooks/useDisponibilidad"
import AlertaDisponibilidad from "src/pages/home/room-detail/Modals/AlertaDisponibilidad/AlertaDisponibilidad"
import IncidenciasItem from "src/pages/home/room-detail/sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

const Home = ({ onChangeSection }: { onChangeSection: (section: CleanDetailSection) => void }) => {
    const room = useRoom()
    const navigate = useNavigate()
    const { rolName } = useProfile()
    const cleanTypes = useCleaningTypes()
    const { alerta_por_disponibilidad } = useDisponibilidadHabitacion()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const getCleanType = () => {
        const tipoLimpieza = room?.ultimos_datos?.ultima_limpieza?.[0]?.tipo_limpieza
        return cleanTypes.find(({ value }) => value === tipoLimpieza)
    }

    const [isLockRoomModalOpen, setIsLockRoomModalOpen] = useState(false)
    const [isReportIncidenceModalOpen, setIsReportIncidenceModalOpen] = useState(false)
    const [modalAlert, setModalAlert] = useState<boolean>(false)
    const [alertReason, setAlertReason] = useState<string>("")

    const mant = room?.ultimos_datos?.ultimo_mantenimiento
    const colabMant = mant?.colaborador

    const openModal = (value) => {
        setAlertReason(value)
        setModalAlert(true)
    }

    return (
        <DrawerWrapper
            withMenu
            itemsMenu={[
                {
                    label: "Reportar incidencia",
                    onClick: validateIsColabActive(() => {
                        setIsReportIncidenceModalOpen(true)
                    }),
                },
                {
                    label: "Bloquear habitación",
                    onClick: validateIsColabActive(() => {
                        alerta_por_disponibilidad ? openModal("Bloquear") : setIsLockRoomModalOpen(true)
                    }),
                },
            ]}
        >
            <HomeView title={`${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`} subtitle={room?.status}>
                <div className="room-detail--clean__home">
                    <Block>
                        {!!room?.ultimos_datos?.ultima_limpieza.length && (
                            <DescriptionDetailList
                                iconName="broom"
                                title="Última limpieza"
                                subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                                values={room?.ultimos_datos?.ultima_limpieza?.map(
                                    (c) =>
                                        `${c.colaborador?.nombre} ${c.colaborador?.apellido_paterno} ${c.colaborador?.apellido_materno}`
                                )}
                                link={rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo ? "Limpiar" : ""}
                                onLink={validateIsColabActive(() => onChangeSection("clean-staff"))}
                            />
                        )}
                        <DescriptionDetail
                            icon="businessStar"
                            label="Tipo de limpieza"
                            style={{
                                width: "100%",
                                padding: "12px",
                            }}
                            value={getCleanType()?.label || "-"}
                        />
                        <DescriptionDetail
                            date={`${mant?.fecha_termino ? formatTimeAgo(mant?.fecha_termino) : "-"}`}
                            icon="tools"
                            label="Último mantenimiento"
                            link={rolName !== RoleNames.valet && rolName !== RoleNames.monitoreo && rolName !== RoleNames.mantenimiento ? "Mantenimiento" : ""}
                            onLink={() => {
                                alerta_por_disponibilidad
                                    ? openModal("Mantenimiento")
                                    : onChangeSection("maintenance-reason")
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                            }}
                            value={`${
                                mant
                                    ? colabMant
                                        ? `${colabMant?.nombre} ${colabMant?.apellido_paterno} ${colabMant?.apellido_materno}`
                                        : "Sin colaborador asignado"
                                    : "-"
                            }`}
                        />
                        <DescriptionDetail
                            icon="BookOpen"
                            label="Última reservación asignada"
                            link={rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo ? "Asignar reserva" : ""}
                            linkBottom={true}
                            onLink={() => {
                                onChangeSection("reservation")
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                            }}
                            value={`${formatDate(new Date(room?.ultima_reserva?.reserva?.fecha_registro), "comma")}`}
                        />
                        <DescriptionDetail
                            icon="Exchange"
                            label="Rentas del día"
                            style={{
                                width: "100%",
                                padding: "12px",
                            }}
                            value={room?.rentas_today}
                        />
                        <DescriptionDetail
                            icon="CheckBoxMultipleFill"
                            label="Último responsable de liberación"
                            style={{
                                width: "100%",
                                padding: "12px",
                            }}
                            value={
                                room?.ultimos_datos?.ultima_supervision?.colaborador
                                    ? `${room.ultimos_datos.ultima_supervision.colaborador.nombre} ${room.ultimos_datos.ultima_supervision.colaborador.apellido_paterno} ${room.ultimos_datos.ultima_supervision.colaborador.apellido_materno}`
                                    : "-"
                            }
                        />
                        <ItemTimer
                            label="Tiempo en preparación"
                            icon="Stopwatch"
                            dateTimer={room?.fecha_estado || ""}
                            itemsContainerStyle={{
                                padding: "12px",
                            }}
                        />
                        <IncidenciasItem />
                    </Block>
                    {rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && (
                        <PrimaryButton
                            style={{ position: "relative", bottom: "0" }}
                            text={"Poner a la venta"}
                            onClick={validateIsColabActive(() =>
                                navigate(`/u/habitacion-detalle/liberar/${room.habitacion_id}`)
                            )}
                        />
                    )}
                </div>
            </HomeView>
            <LockRoom isOpen={isLockRoomModalOpen} onClose={() => setIsLockRoomModalOpen(false)} />
            <ReportIncidence isOpen={isReportIncidenceModalOpen} onClose={() => setIsReportIncidenceModalOpen(false)} />
            <AlertaDisponibilidad
                isOpen={modalAlert}
                onClose={() => setModalAlert(false)}
                onClick={() =>
                    alertReason === "Bloquear" ? setIsLockRoomModalOpen(true) : onChangeSection("maintenance-reason")
                }
            />
            {InactiveModal}
        </DrawerWrapper>
    )
}

export default Home
