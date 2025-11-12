import useSubmitEvent from "../../hooks/useSubmitEvent"
import { Estados_Habitaciones, useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import { useSelectedRoom } from "src/pages/home/room-detail/hooks/selected"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useOnFinished from "../../hooks/useOnFinished"
import { SectionProps } from "../../types/props.types"
import { useEffect } from "react"

const Preparada = ({ isSubmitLoading, setIsDataLoading, setIsSubmitLoading }: SectionProps) => {
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const room = useSelectedRoom()
    const { usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { onFinished } = useOnFinished({ onEnd: () => setIsSubmitLoading(false) })

    useEffect(() => {
        setIsDataLoading(false)
    }, [])

    const onConfirm = async () => {
        if (isSubmitLoading) {
            return
        }
        setIsSubmitLoading(true)
        try {
            await finalizarTarea({
                variables: {
                    datos_tarea: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        usuario_id,
                        estado: Estados_Habitaciones.Preparada,
                    },
                },
            })
            showSnackbar({
                title: "Supervisión concluida",
                text: `La habitación **${room?.nombre}** pasará a preparada`,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al pasar habitación a preparada",
                status: "error",
            })
            console.log(e)
        } finally {
            setIsSubmitLoading(false)
        }
    }

    useSubmitEvent({ onEvent: onConfirm })

    return <></>
}

export default Preparada
