import React, { useEffect, useState } from "react"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import Empty from "src/shared/components/data-display/empty/Empty"
import { TextBox } from "src/shared/components/forms"
import { v4 as uuid } from "uuid"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import { Habitacion } from "src/gql/schema"
import { useMutation, useQuery } from "@apollo/client"
import { AGREGAR_COMENTARIO_HABITACION } from "src/pages/home/graphql/mutations/comentarios"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import "./Comments.css"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const CommentsBloqueada = () => {
    const room = useRoom()
    const { usuario_id, rolName, hotel_id } = useProfile()
    const { formatCustomDate } = useFormatDate()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const { showMiniSnackbar } = useMiniSnackbar()
    const canAddComments = rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo

    const { data, loading } = useQuery<{ habitacion: Habitacion }>(GET_ROOM, {
        variables: { habitacion_id: room?.habitacion_id, usuario_id, hotel_id },
    })

    const [addComentarioHabitacion] = useMutation(AGREGAR_COMENTARIO_HABITACION)

    const [textboxValue, setTextboxValue] = useState("")
    const [comentariosList, setComentariosList] = useState<any[]>([])

    useEffect(() => {
        setComentariosList(data?.habitacion?.comentarios || [])
    }, [data])

    const confirmComentario = async () => {
        if (!textboxValue.trim()) return

        try {
            const { data: mutationData } = await addComentarioHabitacion({
                variables: {
                    input: {
                        habitacion_id: room?.habitacion_id,
                        comentario: {
                            usuario_id,
                            comentario: textboxValue,
                        },
                    },
                },
            })

            setComentariosList(mutationData?.agregar_comentario_habitacion?.comentarios || [])
            setTextboxValue("")
            showMiniSnackbar({ title: "Comentario", status: "success", text: "Comentario agregado exitosamente" })
        } catch {
            showMiniSnackbar({ title: "Error", status: "error", text: "No se pudo agregar el comentario" })
        }
    }

    return (
        <div className="animante__opacity-transform__ease room-detail--bloqueada__tab--comments">
            {!loading && !comentariosList.length ? (
                <div className="room-detail--bloqueada__tab--comments--container-empty">
                    <div />
                    <div className="room-detail--bloqueada__tab--comments-content">
                        <Empty icon="communication" theme="dark" title="Sin comentarios o reportes" />
                    </div>
                </div>
            ) : (
                <div className="room-detail--bloqueada__tab--comments--container">
                    {comentariosList.map((comentario) => (
                        <DescriptionDetail
                            key={uuid()}
                            label={formatCustomDate(comentario.fecha, "MMM, DD YYYY - h:mm A")}
                            value={comentario.comentario}
                            style={{ margin: "12px 0" }}
                        />
                    ))}
                </div>
            )}

            {canAddComments && (
                <>
                    <TextBox
                        style={{ width: "90%" }}
                        className="room-detail--bloqueada__tab--comments-content"
                        characterLimit={100}
                        onChange={(e) => setTextboxValue(e.target.value)}
                        value={textboxValue}
                        error={textboxValue.length > 100}
                        errorHintText={textboxValue.length > 100 ? "No más de 100 caracteres" : ""}
                    />
                    <PrimaryButton
                        text="Guardar comentario"
                        onClick={validateIsColabActive(confirmComentario)}
                        style={{ marginBottom: "12px" }}
                    />
                </>
            )}
            {InactiveModal}
        </div>
    )
}

export default CommentsBloqueada
