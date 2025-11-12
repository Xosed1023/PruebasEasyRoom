import "./Comments.css"
import { AGREGAR_COMENTARIO_RESERVA, GET_COMENTARIOS_RESERVA } from "src/pages/home/graphql/mutations/booking"
import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useRef, useState } from "react"
import { TextBox } from "src/shared/components/forms"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { Controller, useForm } from "react-hook-form"
import { ItemMultiplePayment } from "src/pages/home/room-detail/sections/items/Items"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export const Comments = ({
    value,
    isNoShow,
    reservaId,
}: {
    value?: string
    isNoShow?: boolean
    reservaId?: string
}) => {
    const { data, refetch } = useQuery(GET_COMENTARIOS_RESERVA, {
        variables: {
            id: [reservaId],
        },
    })
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [agregarComentarioReserva] = useMutation(AGREGAR_COMENTARIO_RESERVA)

    const [comentarios, setComentarios] = useState<any>([])

    useEffect(() => {
        setComentarios(data?.reservas?.[0]?.comentarios)
    }, [data])
    const [isCommentMode, setIsCommentMode] = useState(false)
    

    const { showMiniSnackbar } = useMiniSnackbar()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmitComment = (data) => {
        if (!data?.comentarios?.trim?.()) {
            return
        }
        agregarComentarioReserva({
            variables: {
                agregar_comentario_reserva: {
                    comentario: data?.comentarios,
                    reserva_id: reservaId,
                },
            },
        })
            .then(() => {
                showMiniSnackbar({
                    status: "success",
                    title: "Comentario agregado",
                    text: "Comentario agregado exitosamente",
                })
                refetch()
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al agregar comentario",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
    }
    const commentForm = useRef<HTMLFormElement>(null)

    const canAddComment = !isNoShow && rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO"

    const triggerCommentSubmit = () => {
        handleSubmit(onSubmitComment)()
        reset()
        setIsCommentMode(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmitComment)} ref={commentForm} className="page__reservada__detalles__spacer">
            <DescriptionDetail
                icon="communication"
                label="Comentarios"
                style={{
                    width: "100%",
                }}
                link= {canAddComment ? (isCommentMode ? "Guardar" : "Agregar") : ""}
                onLink={validateIsColabActive(() => {
                    if (isCommentMode) {
                        triggerCommentSubmit()
                        return
                    }
                    setIsCommentMode(true)
                })}
                value={""}
            />
            <ItemMultiplePayment
                icon={""}
                className="page__reservada__detalles__spacer"
                showAmounts={false}
                label={""}
                payments={comentarios?.map((c) => ({ label: c.comentario }))}
            />
            {isCommentMode && (
                <Controller
                    control={control}
                    name={"comentarios"}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            className="page__reservada__detalles__textbox"
                            placeholder="Escribe un comentario..."
                            onChange={(value) => {
                                if (value.target.value.length > 0) onChange(value.target.value)
                                else onChange(undefined)
                            }}
                            errorHintText={errors.comentarios ? "Ingresa un comentario" : undefined}
                            error={errors.comentarios ? true : false}
                            value={value || ""}
                        />
                    )}
                />
            )}
            {InactiveModal}
        </form>
    )
}
