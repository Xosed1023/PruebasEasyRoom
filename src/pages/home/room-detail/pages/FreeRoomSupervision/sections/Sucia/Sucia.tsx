import useSubmitEvent from "../../hooks/useSubmitEvent"
import { Estados_Habitaciones, useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import { useSelectedRoom } from "src/pages/home/room-detail/hooks/selected"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useOnFinished from "../../hooks/useOnFinished"
import { SectionProps } from "../../types/props.types"
import { useEffect } from "react"
import { TextBox } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"

const Sucia = ({ isSubmitLoading, setIsDataLoading, setIsSubmitLoading, showComments }: SectionProps) => {
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const room = useSelectedRoom()
    const { usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { onFinished } = useOnFinished({ onEnd: () => setIsSubmitLoading(false) })

    const {
        control,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            comentarios: "",
        },
    })
    useEffect(() => {
        setIsDataLoading(false)
    }, [])

   
    const onConfirm = async () => {
        if (isSubmitLoading) {
            return
        }
        setIsSubmitLoading(true)
        const comentario = getValues("comentarios")?.trim()
        try {
            await finalizarTarea({
                
                variables: {
                    datos_tarea: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        usuario_id,
                        estado: Estados_Habitaciones.Sucia,
                        comentarios_tarea: comentario || undefined,
                    },
                },
            })
            showSnackbar({
                title: "Habitación ",
                text: `La habitación **${room?.nombre}** pasó de **supervisión** a **sucia.**`,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al pasar habitación a sucia",
                status: "error",
            })
            console.log(e)
        } finally {
            setIsSubmitLoading(false)
        }
    }

    useSubmitEvent({ onEvent: onConfirm })

    return (
        <form className="free-room-supervisor__comment-box">
            {showComments && (
                <Controller
                    name="comentarios"
                    control={control}
                    rules={{
                        required: false,
                    }}
                    render={({ field }) => (
                        <TextBox
                            placeholder="Escribe un comentario..."
                            description="Comentarios"
                            characterLimit={80}
                            value={field.value}
                            onChange={field.onChange}
                            style={{ width: "100%" }}
                            error={!!errors?.comentarios}   
                            errorHintText={errors?.comentarios ? "Máximo 80 caracteres" : ""}
                        />
                    )}
                />
            )}
        </form>
    )
}

export default Sucia
