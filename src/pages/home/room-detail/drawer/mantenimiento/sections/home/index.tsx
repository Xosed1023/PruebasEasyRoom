import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { HomeView } from "../../../../sections/views/Views"
import { Block, PrimaryButton, SecondaryButton } from "../../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../../general/index.type"
import { useRoom } from "../../../../hooks"
import AvatarProgressCard from "src/shared/components/data-display/AvatarProgressCard/AvatarProgressCard"
import { TabsNavigation } from "./Tabs"
import { Comment } from "./Comment"
import { useRoomDarwer } from "src/pages/home/room-detail/hooks/darwer"
import { useDate } from "src/shared/hooks/useDate"
import IncidenciasItem from "src/pages/home/room-detail/sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { RoleNames } from "src/shared/hooks/useAuth"

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const navigate = useNavigate()
    const { visible } = useRoomDarwer()
    const { UTCStringToLocalDate } = useDate()
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const getUltimosDatos = () => {
        const limpieza = room?.ultimos_datos?.ultima_limpieza
        const mantenimiento = room?.ultimos_datos?.ultimo_mantenimiento
        const tareaEnCurso = room?.tarea_en_curso

        return {
            limpieza,
            mantenimiento,
            tareaEnCurso,
        }
    }

    const data = useMemo(() => {
        const { mantenimiento: mant, tareaEnCurso } = getUltimosDatos()
        const colabMant = mant?.colaborador
        const descMantenimiento = room?.colaborador_tareas_sin_finalizar?.[0]?.descripcion_tarea
        const reportadoPor = tareaEnCurso?.reportada_por ? tareaEnCurso?.reportada_por?.nombre + " " + tareaEnCurso?.reportada_por?.apellido_paterno + " " + tareaEnCurso?.reportada_por?.apellido_materno : "-"
        const fechaReporte = tareaEnCurso?.fecha_inicio ? formatLongDate(UTCStringToLocalDate(tareaEnCurso?.fecha_salida), true, false) : "-"
        return [
            {
                icon: "tools",
                label: "Motivo de mantenimiento",
                value: descMantenimiento || "-",
            },
            {
                icon: "draft",
                label: "Reportado por",
                value: reportadoPor || "-",
            },
            {
                icon: "calendarFill",
                label: "Fecha de reporte",
                value: fechaReporte || "-",
            },
            {
                icon: "calendarFill",
                label: "Último mantenimiento",
                value: `${
                    mant?.colaborador_id
                        ? colabMant
                            ? `${colabMant?.nombre} ${colabMant?.apellido_paterno} ${colabMant?.apellido_materno}`
                            : "Sin colaborador asignado"
                        : "-"
                }`,
                date: `${mant?.fecha_termino ? formatTimeAgo(mant?.fecha_termino) : "-"}`,
            },
        ]
    }, [room?.habitacion_id, visible])

    const cardProps = useMemo(() => {
        const colaboradorTareaFirst = room?.colaborador_tareas_sin_finalizar?.[0]
        const visibleColaborador = colaboradorTareaFirst?.colaborador_id

        const colaboradorName = `${colaboradorTareaFirst?.colaborador?.nombre} ${colaboradorTareaFirst?.colaborador?.apellido_paterno} ${colaboradorTareaFirst?.colaborador?.apellido_materno}`
        return {
            timeLimit: UTCStringToLocalDate(room.fecha_estado),
            timeStart: UTCStringToLocalDate(room.fecha_estado),
            avatarName: visibleColaborador ? colaboradorName : "Sin personal asignado",
            avatarSrcs: visibleColaborador
                ? room?.colaborador_tareas_sin_finalizar?.map((t) => t?.colaborador?.foto)
                : [],
        }
    }, [room?.habitacion_id, visible])

    return (
        <HomeView title={room?.nombre} subtitle={"Mantenimiento"}>
            <AvatarProgressCard
                {...cardProps}
                progressbarDescriprionTop={"Tiempo en mantenimiento"}
                withPlusOnTimeExceeded={false}
            />
            <TabsNavigation>
                <div className="detalle-h-mant__home__block">
                    <Block scroll style={{ rowGap: 24, paddingTop: 30, height: "calc(100% - 116px)", marginBottom: 0 }} list>
                        {data.map((item, index) => (
                            <DescriptionDetail key={index} {...item} />
                        ))}
                        {!!room?.ultimos_datos?.ultima_limpieza.length && (
                            <DescriptionDetailList
                                iconName="broom"
                                title="Última limpieza"
                                subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                                values={room?.ultimos_datos?.ultima_limpieza?.filter((c)=>c?.colaborador)?.map(
                                    (c) =>
                                        `${c.colaborador?.nombre} ${c.colaborador?.apellido_paterno} ${c.colaborador?.apellido_materno}`
                                )}
                            />
                        )}
                        <IncidenciasItem />
                    </Block>

                    {rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && (
                        <div>
                            <PrimaryButton
                                text={"Finalizar mantenimiento"}
                                style={{ marginBottom: 12 }}
                                onClick={validateIsColabActive(() => {
                                    navigate(`/u/detalle-habitacion/liberar-mantenimiento/${room?.habitacion_id}`)
                                })}
                            />
                            <SecondaryButton text={"Cambiar personal"} onClick={validateIsColabActive(() => onNavigate("mantenance-staff"))} />
                        </div>
                    )}
                </div>
                <Comment />
            </TabsNavigation>
            {InactiveModal}
        </HomeView>
    )
}

export default Home
