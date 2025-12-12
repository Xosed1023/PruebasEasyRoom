import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import AvatarProgressCard from "src/shared/components/data-display/AvatarProgressCard/AvatarProgressCard"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { HomeView } from "../../../sections/views/Views"
import { Block, PrimaryButton, SecondaryButton } from "../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../general/index.type"
import { useRoom } from "../../../hooks"
import { useRoomDarwer } from "../../../hooks/darwer"
import { useCleaningTypes } from "../../../hooks/limpieza"
import { useDate } from "src/shared/hooks/useDate"
import addMinutes from "src/shared/helpers/addMinutes"
import IncidenciasItem from "src/pages/home/room-detail/sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const changeSupervisorRoles: string[] = [RoleNames.admin, RoleNames.recepcionista, RoleNames.superadmin]

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const navigate = useNavigate()
    const { UTCStringToLocalDate } = useDate()
    const { visible } = useRoomDarwer()
    const cleanTypes = useCleaningTypes()
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

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
                ...(rolName !== RoleNames.mantenimiento && {
                    link: "Mantenimiento",
                    onLink: () => onNavigate("mantenance-reason"),
                }),
            },
        ]
    }, [room?.habitacion_id, visible])

    const cardProps = useMemo(() => {
        const colaboradorTareaFirst = room?.colaborador_tareas_sin_finalizar?.[0]
        const colaboradorName = `${colaboradorTareaFirst?.colaborador?.nombre} ${colaboradorTareaFirst?.colaborador?.apellido_paterno} ${colaboradorTareaFirst?.colaborador?.apellido_materno}`

        return {
            timeLimit: addMinutes({
                utcDate: room.fecha_estado,
                minutes: room?.tipo_habitacion?.minutos_supervision,
            }),
            timeStart: UTCStringToLocalDate(room.fecha_estado),
            avatarName: colaboradorName || "-",
            avatarSrcs: room?.colaborador_tareas_sin_finalizar?.map((t) => t?.colaborador?.foto),
        }
    }, [room?.habitacion_id, visible])

    return (
        <HomeView title={room?.nombre} subtitle={"En supervisión"}>
            <div
                style={{
                    height: "calc(100% - 67px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <AvatarProgressCard {...cardProps} progressbarDescriprionTop={"Tiempo en supervisión"} />
                    <Block style={{ rowGap: 24, marginTop: 30 }} list>
                        {!!room?.ultimos_datos?.ultima_limpieza.length && (
                            <DescriptionDetailList
                                iconName="broom"
                                title="Última limpieza"
                                subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                                values={room?.ultimos_datos?.ultima_limpieza?.map(
                                    (c) =>
                                        `${c.colaborador?.nombre} ${c.colaborador?.apellido_paterno} ${c.colaborador?.apellido_materno}`
                                )}
                                {...(rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo
                                    ? {
                                        link: "Limpiar",
                                        onLink: () => onNavigate("clean-staff"),
                                    }
                                    : {})}
                            />
                        )}
                        {data.map((item, index) => (
                            <DescriptionDetail key={index} {...item} />
                        ))}
                        <IncidenciasItem />
                    </Block>
                </div>
                <div>
                    {rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && (
                        <PrimaryButton
                            text={"Finalizar supervisión"}
                            onClick={validateIsColabActive(() =>
                                navigate(`/u/detalle-habitacion/liberar-supervision/${room?.habitacion_id}`)
                            )}
                        />
                    )}
                    {changeSupervisorRoles.includes(rolName) && (
                        <SecondaryButton
                            style={{ marginTop: 15 }}
                            text={"Cambiar supervisora"}
                            onClick={validateIsColabActive(() => onNavigate("change-supervisor-staff"))}
                        />
                    )}
                </div>
            </div>
            {InactiveModal}
        </HomeView>
    )
}

export default Home
