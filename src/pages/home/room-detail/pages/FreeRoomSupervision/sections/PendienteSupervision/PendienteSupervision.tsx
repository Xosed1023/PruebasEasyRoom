import React, { useEffect } from "react"
import useSubmitEvent from "../../hooks/useSubmitEvent"
import { Estados_Habitaciones, useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import { useSelectedRoom } from "src/pages/home/room-detail/hooks/selected"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useOnFinished from "../../hooks/useOnFinished"
import { SectionProps } from "../../types/props.types"

const PendienteSupervision = ({
    isSubmitLoading,
    setIsDataLoading,
    setIsSubmitLoading
}: SectionProps) => {
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const room = useSelectedRoom()
    const { usuario_id, hotel_id } = useProfile()
    const { onFinished } = useOnFinished({ onEnd: () => setIsSubmitLoading(false) })

    useEffect(() => {
        setIsDataLoading(false)
    }, [])
    

    const { showSnackbar } = useSnackbar()
    const onConfirm = async () => {
        if (isSubmitLoading) {
            return
        }
        setIsSubmitLoading(true)
        try {
            await finalizarTarea({
                variables: {
                    datos_tarea: {
                        hotel_id,
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        usuario_id,
                        estado: Estados_Habitaciones.SupervisionPendiente,
                    },
                },
            })
            showSnackbar({
                title: "Habitación pendiente de supervisión",
                text: `La habitación **${room?.nombre}** pasó de pendiente de supervisión.`,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al asignar habitación a pendiente de supervisión",
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

export default PendienteSupervision
