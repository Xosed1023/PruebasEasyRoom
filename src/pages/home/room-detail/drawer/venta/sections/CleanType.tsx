import { ListView } from "../../../sections/views/Views"
import { Block, TouchableBoldCard } from "../../../sections/elements/Elements"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { SectionProps } from "../index.type"
import { useRoom } from "../../../hooks"
import { handleErrorMessage } from "src/utils/promise"
import { assignColaborador } from "../../../helpers/colaborador"
import {
    Estados_Habitaciones,
    TiposLimpiezas,
    useCambiarTareaConEstadoMutation,
    useActualizar_Colaboradores_TareasMutation,
    TiposTarea,
} from "src/gql/schema"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { useDispatch } from "react-redux"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCloseDrawer } from "../../../helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useCleaningTypes } from "../../../hooks/limpieza"

const CleanType = ({ state }: SectionProps) => {
    const room = useRoom()
    const { isLoading, toggleIsLoading } = useLoadingState()
    const [cambiarTareaConEstado] = useCambiarTareaConEstadoMutation()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { usuario_id, hotel_id } = useProfile()
    const dispatch = useDispatch()
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const data = useCleaningTypes()

    const { closeDrawer } = useCloseDrawer(() => {
        toggleIsLoading({ value: false })
    })

    const updateTarea = () =>
        finalizarTarea({
            variables: {
                datos_tarea: {
                    usuario_id,
                    hotel_id,
                    colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                        (c) => c?.colaborador_tarea_id
                    ),
                },
            },
        })

    const handleSelectCleaning = async (label: string, value: string, minutes: string) => {
        if (isLoading) return

        toggleIsLoading({ value: true })
        const description = `Limpieza de la habitación ${room?.nombre}`
        const fullLabel = `${label} de ${minutes}`

        try {
            if (room?.colaborador_tareas_sin_finalizar.length) {
                const descripcion = `Supervisión de la habitación ${room?.nombre}`

                await cambiarTareaConEstado({
                    variables: {
                        switch_task_with_room_state_input: {
                            hotel_id,
                            tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                            colaborador_id: state?.colaboradores?.map((c) => c?.colaborador_id),
                            colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                                (c) => c?.colaborador_tarea_id
                            ),
                            habitacion_id: room?.habitacion_id,
                            estado_habitacion: Estados_Habitaciones.Limpieza,
                            tarea: {
                                descripcion,
                                nombre: "Supervisión de habitación",
                                puesto_id: state?.colaboradores?.[0]?.puesto_id || "",
                                tipo: TiposTarea.Supervision,
                            },
                            usuario_id,
                            tipo_limpieza: value as TiposLimpiezas,
                        },
                    },
                })

                showMiniSnackbar({
                    title: "Limpieza de habitación",
                    text:
                        state.colaboradores?.length <= 1
                            ? `**${state.colaboradores[0].nombre}** comenzará con la **${fullLabel}** de la habitación **${room?.nombre}**`
                            : `**${state.colaboradores.length} camaristas** comenzarán con la **${fullLabel}** de la habitación **${room?.nombre}**`,
                    status: "success",
                })
            } else {
                if (room.estado === Estados_Habitaciones.Supervision) {
                    await updateTarea()
                }

                await assignColaborador({
                    datos_tarea: {
                        nombre: "Limpieza de habitación",
                        descripcion: description,
                        puesto_id: state?.puesto_id,
                        tipo: TiposTarea.Limpieza,
                    },
                    datos_colaborador_tarea: {
                        colaborador_ids: [state?.colaborador_id],
                        descripcion_tarea: description,
                        habitacion_id: room?.habitacion_id,
                        tipo_limpieza: value,
                    },
                    usuario_id,
                    hotel_id,
                    estadoHabitacion: Estados_Habitaciones.Limpieza,
                })

                dispatch(toggleRoomDetailsDrawer(false))
                showMiniSnackbar({
                    title: "Limpieza de habitación",
                    text: `**${state?.nombre}** comenzará con la **${fullLabel}** en la habitación **${room?.nombre}.**`,
                    status: "success",
                })
            }
        } catch (e) {
            handleErrorMessage(e)
        } finally {
            toggleIsLoading({ value: false })
            closeDrawer()
        }
    }

    return (
        <ListView title="¿Qué tipo de limpieza vas a realizar?">
            <div className="detalle-h-venta__clean-type__box">
                <Block list scroll className="detalle-h-venta__block-mg">
                    {data.map(({ label = "", value = "", minutes = "" }, index) => (
                        <TouchableBoldCard
                            key={index}
                            subtitleStyle={{ fontSize: 12, fontWeight: 400 }}
                            title={label}
                            subtitle={`Tiempo: **${minutes}**`}
                            onClick={() => handleSelectCleaning(label, value, minutes)}
                        />
                    ))}
                </Block>
                <LoaderComponent visible={isLoading} />
            </div>
        </ListView>
    )
}

export default CleanType
