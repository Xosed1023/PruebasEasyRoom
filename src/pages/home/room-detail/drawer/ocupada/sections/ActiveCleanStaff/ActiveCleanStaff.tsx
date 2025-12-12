import React from "react"
import profileDefault from "src/assets/webp/profile_default.webp"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { useDispatch } from "react-redux"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import { Block, PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Estados_Habitaciones, useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { formatTimeAgo } from "src/utils/timeago"

const ActiveCleanStaff = ({ onSwapColaborador }: { onSwapColaborador: () => void }) => {
    const room = useRoom()
    const dispatch = useDispatch()
    const { showMiniSnackbar } = useMiniSnackbar()
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const { usuario_id, hotel_id } = useProfile()

    return (
        <ListView
            title="Reasignación de camarista para limpieza"
            subtitle="Camaristas disponibles"
            subtitleStyle={{ fontWeight: 400 }}
        >
            <div className="detalle-h-general__mantenance__box">
                <Block list scroll className="detalle-h-general__block-active__staff animante__opacity-transform__ease">
                    {room?.colaborador_tareas_sin_finalizar?.map(
                        ({
                            colaborador_id = "",
                            colaborador: { nombre = "", apellido_materno = "", apellido_paterno = "", foto = "" },
                            fecha_inicio,
                        }) => (
                            <CardStaff
                                key={colaborador_id}
                                name={`${nombre} ${apellido_paterno} ${apellido_materno}`}
                                description={`En limpieza desde hace: **${
                                    fecha_inicio
                                        ? formatTimeAgo(fecha_inicio) === "Justo ahora"
                                            ? formatTimeAgo(fecha_inicio)
                                            : formatTimeAgo(fecha_inicio).split("Hace ")[1]
                                        : "-"
                                }**`}
                                picture={foto || profileDefault}
                                active={false}
                            />
                        )
                    )}
                </Block>
                <PrimaryButton
                    text={"Finalizar limpieza"}
                    style={{ marginBottom: 12 }}
                    onClick={() =>
                        finalizarTarea({
                            variables: {
                                datos_tarea: {
                                    colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                        (c) => c?.colaborador_tarea_id
                                    ),
                                    usuario_id,
                                    hotel_id,
                                    estado: Estados_Habitaciones.Ocupada,
                                },
                            },
                        })
                            .then(() => {
                                showMiniSnackbar({
                                    title: "Limpieza finalizada",
                                    status: "success",
                                    text: `La limpieza ha finalizado con éxito en la **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}**`,
                                })
                                dispatch(toggleRoomDetailsDrawer(false))
                            })
                            .catch(() => {
                                showMiniSnackbar({
                                    title: "Error al finalizar limpieza",
                                    status: "error",
                                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                                })
                            })
                    }
                />
                <SecondaryButton text={"Cambiar o agregar camarista"} onClick={() => onSwapColaborador()} />
            </div>
        </ListView>
    )
}

export default ActiveCleanStaff
