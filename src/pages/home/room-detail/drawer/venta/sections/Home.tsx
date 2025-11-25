import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import AlertReservas from "../../../sections/components/alert-reservas"
import AlertListaEspera from "../../../sections/components/alert-lista-espera"
import { HomeView } from "../../../sections/views/Views"
import { ItemTimer } from "../../../sections/items/Items"
import { Block, PrimaryButton, SecondaryButton } from "../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../venta/index.type"
import { useRoom } from "../../../hooks"
import { useRoomDarwer } from "../../../hooks/darwer"
import { useCleaningTypes } from "../../../hooks/limpieza"
import { useDisponibilidadHabitacion } from "../hooks/useDisponibilidad"
import AlertaDisponibilidad from "../../../Modals/AlertaDisponibilidad/AlertaDisponibilidad"
import AlertaListaEspera from "../../../Modals/AlertaListaEspera/AlertaListaEspera"
import IncidenciasItem from "../../../sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { RoleNames } from "src/shared/hooks/useAuth"

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const navigate = useNavigate()
    const { rolName } = useProfile()
    const { visible } = useRoomDarwer()
    const cleanTypes = useCleaningTypes()
    const [modalAlert, setModalAlert] = useState<boolean>(false)
    const [modalListaEspera, setModalListaEspera] = useState<boolean>(false)
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const [alertReason, setAlertReason] = useState<string>("")
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const [folioAutorizacion, setFolioAutorizacion] = useState<string | undefined>(undefined)

    const { reservas_del_dia, alerta_por_disponibilidad, alerta_por_turnos_atencion, turnos_en_espera } =
        useDisponibilidadHabitacion()

    const openModal = (value) => {
        setAlertReason(value)
        setModalAlert(true)
    }

    const getCleanType = () => {
        const tipoLimpieza = room?.ultimos_datos?.ultima_limpieza?.[0]?.tipo_limpieza
        return cleanTypes.find(({ value }) => value === tipoLimpieza)
    }

    const data = useMemo(() => {
        const mant = room?.ultimos_datos?.ultimo_mantenimiento
        const colabMant = mant?.colaborador

        return [
            {
                icon: "businessStar",
                label: "Tipo de limpieza",
                value: getCleanType()?.label || "-",
            },
            {
                icon: "tools",
                label: "Último mantenimiento",
                value: `${
                    mant
                        ? colabMant
                            ? `${colabMant?.nombre} ${colabMant?.apellido_paterno} ${colabMant?.apellido_materno}`
                            : "Sin colaborador asignado"
                        : "-"
                }`,
                date: `${mant?.fecha_termino ? formatTimeAgo(mant?.fecha_termino) : "-"}`,
                link:
                    rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo
                        ? "Mantenimiento"
                        : "",
                onLink: validateIsColabActive(() =>
                    alerta_por_disponibilidad ? openModal("Mantenimiento") : onNavigate("mantenance-reason")
                ),
            },
            {
                icon: "Exchange",
                label: "Rentas del día",
                value: `${typeof room?.rentas_today === "number" ? room?.rentas_today : "-"}`,
            },
        ]
    }, [room?.habitacion_id, visible, alerta_por_disponibilidad])

    return (
        <HomeView title={room?.nombre} subtitle="A la venta">
            <div
                style={{
                    height: "calc(100% - 77px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Block style={{ rowGap: 24 }} list>
                    {!!room?.ultimos_datos?.ultima_limpieza.length && (
                        <DescriptionDetailList
                            iconName="broom"
                            title="Última limpieza"
                            subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                            values={room?.ultimos_datos?.ultima_limpieza
                                ?.filter((c) => c.colaborador?.nombre)
                                ?.map(
                                    (c) =>
                                        `${c.colaborador?.nombre} ${c.colaborador?.apellido_paterno} ${c.colaborador?.apellido_materno}`
                                )}
                            link={rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento ? "Limpiar" : ""}
                            onLink={() => onNavigate("clean-staff")}
                        />
                    )}
                    {data.map((item, index) => (
                        <DescriptionDetail key={index} {...item} />
                    ))}
                    <DescriptionDetail
                        icon="CheckBoxMultipleFill"
                        label="Último responsable de liberación"
                        style={{
                            width: "100%",
                        }}
                        value={
                            room?.ultimos_datos?.ultima_supervision?.colaborador
                                ? `${room.ultimos_datos.ultima_supervision.colaborador.nombre} ${room.ultimos_datos.ultima_supervision.colaborador.apellido_paterno} ${room.ultimos_datos.ultima_supervision.colaborador.apellido_materno}`
                                : "-"
                        }
                    />
                    <ItemTimer label="Tiempo a la venta" icon="Stopwatch" dateTimer={room?.fecha_estado || ""} />
                    <IncidenciasItem />
                </Block>
                <div>
                    {turnos_en_espera > 0 && <AlertListaEspera size={turnos_en_espera} />}
                    {reservas_del_dia > 0 && <AlertReservas size={reservas_del_dia} />}

                    {rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && (
                        <>
                            <PrimaryButton
                                text={rolName === RoleNames.valet ? "Vender habitación" : "Rentar habitación"}
                                style={{ marginBottom: 12 }}
                                onClick={validateIsColabActive(() =>
                                    alerta_por_turnos_atencion
                                        ? setModalListaEspera(true)
                                        : alerta_por_disponibilidad
                                        ? openModal("Rentar")
                                        : navigate(`/u/venta-habitacion/${room?.habitacion_id}`)
                                )}
                            />

                            {rolName !== RoleNames.valet && (
                                <SecondaryButton
                                    text={"Asignar habitación a reserva"}
                                    onClick={validateIsColabActive(() => onNavigate("booking"))}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            <AlertaDisponibilidad
                isOpen={modalAlert}
                onClose={() => setModalAlert(false)}
                onClick={() =>
                    alertReason === "Rentar"
                        ? navigate(`/u/venta-habitacion/${room?.habitacion_id}`)
                        : onNavigate("mantenance-reason")
                }
            />
            <AlertaListaEspera
                isOpen={modalListaEspera}
                onClose={() => setModalListaEspera(false)}
                habitacionID={room?.tipo_habitacion_id}
                onConfirm={(folio_turno_id, autorizacionRequerida) => {
                    if (autorizacionRequerida &&  (rolName === RoleNames.recepcionista || rolName === RoleNames.valet)) {
                        setFolioAutorizacion(folio_turno_id)
                        setisAuthModalOpen(true)
                    } else {
                        if (folio_turno_id) {
                            navigate(`/u/venta-habitacion/${room?.habitacion_id}`, { state: { folio_turno_id } })
                        } else {
                            navigate(`/u/venta-habitacion/${room?.habitacion_id}`)
                        }
                    }
                }}
            />
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onClose={() => setisAuthModalOpen(false)}
                authorizedRoles={[RoleNames.admin, RoleNames.superadmin]}
                onAuthFilled={() => {
                    setisAuthModalOpen(false)
                    if (folioAutorizacion) {
                        navigate(`/u/venta-habitacion/${room?.habitacion_id}`, {
                            state: { folio_turno_id: folioAutorizacion },
                        })
                    } else {
                        navigate(`/u/venta-habitacion/${room?.habitacion_id}`)
                    }
                }}
            />
            {InactiveModal}
        </HomeView>
    )
}

export default Home
