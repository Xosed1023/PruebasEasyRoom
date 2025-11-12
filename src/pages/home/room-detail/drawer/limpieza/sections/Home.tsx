import { useMemo } from "react"
import AvatarProgressCard from "src/shared/components/data-display/AvatarProgressCard/AvatarProgressCard"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { HomeView } from "../../../sections/views/Views"
import { Block, PrimaryButton, SecondaryButton } from "../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../general/index.type"
import { useRoom } from "../../../hooks"
import { getDateStringMDY } from "src/utils/date"
import { useCleaningTypes } from "../../../hooks/limpieza"
import { useRoomDarwer } from "../../../hooks/darwer"
import { addTimeByCleaningType } from "src/shared/helpers/addTimeByCleaningType"
import { useDate } from "src/shared/hooks/useDate"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { selectCleaningSection } from "src/store/roomDetails/cleaningSlice"
import IncidenciasItem from "src/pages/home/room-detail/sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const cleanTypes = useCleaningTypes()
    const { UTCStringToLocalDate } = useDate()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { visible } = useRoomDarwer()
    const { rolName } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const comentarios = room?.colaborador_tareas_sin_finalizar?.[0]?.comentarios


    const getCleanType = () => {
        const tipoLimpieza = room?.colaborador_tareas_sin_finalizar?.[0]?.tipo_limpieza
        return cleanTypes.find(({ value }) => value === tipoLimpieza)
    }

    const cardProps = useMemo(() => {
        const colaboradorTareaFirst = room?.colaborador_tareas_sin_finalizar?.[0]

        const cleaningTimeEnd = addTimeByCleaningType({
            date: room?.fecha_estado,
            cleaningType: colaboradorTareaFirst?.tipo_limpieza,
            tiempoLimpiezaDetallada: room?.tipo_habitacion?.minutos_limpieza_detallada,
            tiempoLimpiezaNormal: room?.tipo_habitacion?.minutos_limpieza_normal,
            tiempoLimpiezaRetoque: room?.tipo_habitacion?.minutos_limpieza_retoque,
        })

        const colaboradorName = `${colaboradorTareaFirst?.colaborador?.nombre} ${colaboradorTareaFirst?.colaborador?.apellido_paterno} ${colaboradorTareaFirst?.colaborador?.apellido_materno}`

        return {
            timeLimit: UTCStringToLocalDate(cleaningTimeEnd),
            timeStart: UTCStringToLocalDate(colaboradorTareaFirst?.fecha_inicio),
            avatarName: colaboradorName || "-",
            avatarSrcs: room?.colaborador_tareas_sin_finalizar?.map((t) => t?.colaborador?.foto)?.slice(0, 3),
            descriptionLink:
                room?.colaborador_tareas_sin_finalizar?.length > 1
                    ? `${room?.colaborador_tareas_sin_finalizar?.length > 2 ? "camaristas" : "camarista"}`
                    : "",
            onClickDescriptionLink: () => dispatch(selectCleaningSection("active-cleaning-staff")),
        }
    }, [room?.habitacion_id, visible, room?.habitacion_id?.colaborador_tareas_sin_finalizar])

    return (
        <HomeView title={room?.nombre} subtitle={"En limpieza"}>
            <div
                style={{
                    height: "calc(100% - 77px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ height: "calc(100% - 156px)", marginBottom: 24 }}>
                    <AvatarProgressCard {...cardProps} progressbarDescriprionTop={"Tiempo restante en limpieza"} />
                    <Block scroll style={{ height: "calc(100% - 150px)", rowGap: 24, marginTop: 40 }} list>
                        <DescriptionDetail
                            icon="businessStar"
                            label="Tipo de limpieza"
                            value={getCleanType()?.label || "-"}
                            {...(rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO" && {
                                link: "Cambiar",
                                onLink: () => onNavigate("change-clean-type"),
                            })}
                        />
                        {!!room?.ultimos_datos?.ultima_limpieza.length && (
                            <DescriptionDetailList
                                iconName="broom"
                                title="Última limpieza"
                                subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                                values={room?.ultimos_datos?.ultima_limpieza?.map((c) =>
                                    c.colaborador
                                        ? `${c.colaborador.nombre} ${c.colaborador.apellido_paterno} ${c.colaborador.apellido_materno}`
                                        : "-"
                                )}
                            />
                        )}
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
                            date={formatTimeAgo(room?.ultimos_datos?.ultimo_mantenimiento?.fecha_termino)}
                            {...(rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO" && {
                                link: "Mantenimiento",
                                onLink: () => onNavigate("mantenance-reason"),
                            })}
                        />
                        <DescriptionDetail
                            icon="BookOpen"
                            label="Última reservación asignada"
                            value={
                                room?.utlima_reserva?.reserva?.fecha_entrada
                                    ? getDateStringMDY(room?.utlima_reserva?.reserva?.fecha_entrada)
                                    : "-"
                            }
                            {...(rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO" && {
                                link: "Asignar reserva",
                                onLink: () => onNavigate("booking"),
                            })}
                        />
                        {!!comentarios?.length && (
                            <DescriptionDetail
                                icon="communication"
                                label="Comentario"
                                value={comentarios.map((c) => c.comentario)}
                            />
                        )}

                        <IncidenciasItem />
                    </Block>
                </div>
                {rolName !== "MANTENIMIENTO" &&  rolName !== "MONITOREO" && (
                    <div>
                        <PrimaryButton
                            text={"Finalizar limpieza"}
                            style={{ marginBottom: 12 }}
                            onClick={validateIsColabActive(() =>
                                navigate(`/u/detalle-habitacion/finish-clean/${room?.habitacion_id}`)
                            )}
                        />
                        <SecondaryButton
                            text={"Cambiar o agregar camarista"}
                            onClick={validateIsColabActive(() => onNavigate("clean-staff"))}
                        />
                    </div>
                )}
            </div>
            {InactiveModal}
        </HomeView>
    )
}

export default Home
