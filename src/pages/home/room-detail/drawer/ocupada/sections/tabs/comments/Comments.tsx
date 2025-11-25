import React, { useEffect, useState } from "react"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import Empty from "src/shared/components/data-display/empty/Empty"
import { TextBox } from "src/shared/components/forms"
import { v4 as uuid } from "uuid"

import "./Comments.css"
import { GET_ROOM } from "src/pages/home/graphql/queries/rooms.query"
import { Habitacion } from "src/gql/schema"
import { useMutation, useQuery } from "@apollo/client"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { useDate } from "src/shared/hooks/useDate"
import { ADD_COMENTARIO_RENTA } from "src/pages/home/graphql/mutations/rentas"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

const Comments = () => {
    const room = useRoom()
    const { usuario_id, rolName, hotel_id } = useProfile()

    const { UTCStringToLocalDate } = useDate()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const { data, refetch, loading } = useQuery<{ habitacion: Habitacion }>(GET_ROOM, {
        variables: { habitacion_id: room?.habitacion_id, usuario_id: usuario_id, hotel_id },
    })

    const [addComentarioRenta] = useMutation(ADD_COMENTARIO_RENTA)

    const [textboxValue, setTextboxValue] = useState("")
    const { showMiniSnackbar } = useMiniSnackbar()

    const [comentariosList, setcomentariosList] = useState<any[]>([])
    const canAddComments = rolName !== RoleNames.valet && rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo

    useEffect(() => {
        setcomentariosList(data?.habitacion?.ultima_renta?.comentarios || [])
    }, [data?.habitacion?.ultima_renta?.comentarios])

    const confirmComentario = () => {
        if (!textboxValue || !textboxValue?.trim()) {
            return
        }
        addComentarioRenta({
            variables: {
                agregar_comentario_renta: {
                    renta_id: data?.habitacion.ultima_renta?.renta_id,
                    comentario: textboxValue,
                },
            },
        }).then(() => {
            refetch({ habitacion_id: room?.habitacion_id })
            showMiniSnackbar({
                title: "Comentario",
                status: "success",
                text: "Comentario agregado exitosamente",
            })
        })
        setTextboxValue("")
    }

    return (
        <div className="animante__opacity-transform__ease room-detail--occupied__tab--huesped--comments">
            {!loading && !data?.habitacion?.ultima_renta?.comentarios?.length ? (
                <div
                    className={`room-detail--occupied__tab--cooments--container-empty ${
                        rolName === RoleNames.mantenimiento || rolName === RoleNames.valet
                            ? "room-detail--occupied__tab--cooments--container-empty--centered"
                            : ""
                    }`}
                >
                    <div></div>
                    <div className="room-detail--occupied__tab--comments">
                        <Empty icon="communication" theme="dark" title="Sin comentarios o peticiones del huésped." />
                    </div>
                    {canAddComments && (
                        <TextBox
                            style={{
                                width: "90%",
                            }}
                            className="room-detail--occupied__tab--comments"
                            characterLimit={100}
                            onChange={(value) => {
                                setTextboxValue(value.target.value)
                            }}
                            value={textboxValue}
                            error={textboxValue.length > 100}
                            errorHintText={textboxValue.length > 100 ? "No más de 100 caracteres" : ""}
                        />
                    )}
                </div>
            ) : (
                <>
                    <div className="room-detail--occupied__tab--cooments--container">
                        {comentariosList.map((comentario) => (
                            <DescriptionDetail
                                key={uuid()}
                                label={formatLongDate(UTCStringToLocalDate(comentario.fecha))}
                                style={{
                                    margin: "12px 0",
                                }}
                                value={comentario.comentario}
                            />
                        ))}
                    </div>
                    <TextBox
                        style={{
                            width: "90%",
                        }}
                        className="room-detail--occupied__tab--comments"
                        characterLimit={100}
                        onChange={(value) => {
                            setTextboxValue(value.target.value)
                        }}
                        value={textboxValue}
                        error={textboxValue.length > 100}
                        errorHintText={textboxValue.length > 100 ? "No más de 100 caracteres" : ""}
                    />
                </>
            )}
            {canAddComments && (
                <PrimaryButton
                    text={"Guardar comentario"}
                    onClick={validateIsColabActive(() => confirmComentario())}
                    style={{ marginBottom: "12px" }}
                />
            )}
            {InactiveModal}
        </div>
    )
}

export default Comments
