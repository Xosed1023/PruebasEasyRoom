import { useNavigate } from "react-router-dom"
import { useState } from "react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { HomeView } from "../../../sections/views/Views"
import { Block, PrimaryButton, Tabs } from "../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../venta/index.type"
import { useRoom } from "../../../hooks"
import { ItemTimer } from "../../../sections/items/Items"
import { getDateStringMDY } from "src/utils/date"
import { useCleaningTypes } from "../../../hooks/limpieza"
import IncidenciasItem from "../../../sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import CommentsBloqueada from "../components/comments/Comments"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

const bloqueadaTabs = [
    { label: "Detalle", path: "detalle" },
    { label: "Comentarios", path: "comentarios" },
] as const

type TabPath = (typeof bloqueadaTabs)[number]["path"]

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const navigate = useNavigate()
    const cleanTypes = useCleaningTypes()
    const [activeTab, setActiveTab] = useState<TabPath>("detalle")
    const { rolName } = useProfile()

    const getCleanType = () => {
        const tipoLimpieza = room?.ultimos_datos?.ultima_limpieza?.[0]?.tipo_limpieza
        return cleanTypes.find(({ value }) => value === tipoLimpieza)
    }

    return (
        <HomeView title={room?.nombre} subtitle={"Bloqueada"}>
            <div style={{ height: "calc(100% - 66px)", display: "flex", flexDirection: "column" }}>
                <Tabs value={activeTab} onChange={(val) => setActiveTab(val as TabPath)} tabList={[...bloqueadaTabs]} />

                <div style={{ flexGrow: 1, marginTop: 20, display: 'flex', flexDirection: 'column', height: "calc(100% - 120px)" }}>
                    {activeTab === "detalle" ? (
                        <Block style={{ rowGap: 24 }} list>
                            <DescriptionDetail
                                icon={"LockFill"}
                                label={"Motivo de bloqueo"}
                                value={room?.comentario_estado || "-"}
                            />
                            <ItemTimer label="Tiempo en bloqueo" icon="Stopwatch" dateTimer={room?.fecha_estado || ""} />
                            <DescriptionDetailList
                                iconName="broom"
                                title="Última limpieza"
                                values={room?.ultimos_datos?.ultima_limpieza?.filter(c => c.colaborador_id)?.map(
                                    (c) =>
                                        `${c.colaborador?.nombre} ${c.colaborador?.apellido_paterno} ${c.colaborador?.apellido_materno}`
                                )}
                                subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                                {...(rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && {
                                    link: "Limpiar",
                                    onLink: () => onNavigate("clean-staff"),
                                })}
                            />
                            <DescriptionDetail
                                icon="businessStar"
                                label="Tipo de limpieza"
                                value={getCleanType()?.label || "-"}
                            />
                            <DescriptionDetail
                                icon="tools"
                                label="Último mantenimiento"
                                value={`${
                                    room?.ultimos_datos?.ultimo_mantenimiento
                                        ? room?.ultimos_datos?.ultimo_mantenimiento?.colaborador
                                            ? `${room?.ultimos_datos?.ultimo_mantenimiento?.colaborador?.nombre} ${room?.ultimos_datos?.ultimo_mantenimiento?.colaborador?.apellido_paterno} ${room?.ultimos_datos?.ultimo_mantenimiento?.colaborador?.apellido_materno}`
                                            : "Sin colaborador asignado"
                                        : "-"
                                }`}
                                date={`${
                                    room?.ultimos_datos?.ultimo_mantenimiento?.fecha_termino
                                        ? formatTimeAgo(room?.ultimos_datos?.ultimo_mantenimiento?.fecha_termino)
                                        : "-"
                                }`}
                                {...(rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && {
                                    link: "Mantenimiento",
                                    onLink: () => onNavigate("mantenance-reason"),
                                })}
                            />
                            <DescriptionDetail
                                icon="BookOpen"
                                label="Última reservación asignada"
                                value={`${
                                    room?.ultima_reserva?.reserva?.fecha_registro
                                        ? getDateStringMDY(room?.ultima_reserva?.reserva?.fecha_registro)
                                        : "-"
                                }`}
                                linkBottom
                                {...(rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && {
                                    link: "Asignar reserva",
                                    onLink: () => onNavigate("booking"),
                                })}
                            />
                            <IncidenciasItem />
                        </Block>
                    ) : (
                        <CommentsBloqueada />
                    )}
                </div>

                {activeTab === "detalle" && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && (
                    <div style={{ padding: "16px 0 0" }}>
                        <PrimaryButton
                            text={"Desbloquear"}
                            onClick={validateIsColabActive(() => navigate(`/u/detalle-habitacion/liberar-bloqueada/${room?.habitacion_id}`))}
                        />
                    </div>
                )}
            </div>
            {InactiveModal}
        </HomeView>
    )
}

export default Home
