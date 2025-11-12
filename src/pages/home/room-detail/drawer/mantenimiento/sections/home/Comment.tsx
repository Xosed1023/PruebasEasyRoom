import { useEffect, useState } from "react"
import { useAgregarComentarioATareaMutation, useGetComentariosColaboradorQuery } from "src/gql/schema"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { Block, PrimaryButton, TextArea } from "src/pages/home/room-detail/sections/elements/Elements"
import Empty from "src/shared/components/data-display/empty/Empty"
import { formatDateHor } from "src/shared/hooks/formatDateHor"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useProfile } from "src/shared/hooks/useProfile"
import { handleErrorMessage } from "src/utils/promise"

export const CommentItem = ({ date = "", value = "" }) => {
    return (
        <div>
            <p className="detalle-h-mant__comment__label">{formatDateHor(new Date(date))}</p>
            <p className="detalle-h-mant__comment__value">{value}</p>
        </div>
    )
}

export const Comment = () => {
    const [data, setData] = useState<any[]>([])
    const [load, setLoad] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const room = useRoom()
    const { usuario_id, rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const colaborador_tarea_id =
        room?.colaborador_tarea_id || room?.colaborador_tareas_sin_finalizar[0].colaborador_tarea_id

    const { data: comentariosColaborador } = useGetComentariosColaboradorQuery({
        variables: {
            colaborador_tarea_id,
        },
    })

    const [agregarComentario] = useAgregarComentarioATareaMutation()

    useEffect(() => {
        if (comentariosColaborador) {
            const comments = comentariosColaborador.colaborador_tarea.comentarios
            if (Array.isArray(comments)) setData(comments)
            setLoad(false)
        }
    }, [comentariosColaborador])

    const handleSend = () => {
        setLoad(true)
        if (message) {
            agregarComentario({
                variables: {
                    comentarios: {
                        colaborador_tarea_id,
                        comentarios: [
                            {
                                usuario_id,
                                comentario: message,
                                fecha: new Date().toISOString(),
                            },
                        ],
                    },
                },
            })
                .then(({ data: res }) => {
                    const comments = res?.agregar_comentarios_a_tarea?.comentarios
                    if (Array.isArray(comments) && comments[0]) setData(comments)
                    setMessage("")
                    setLoad(false)
                })
                .catch(handleErrorMessage)
        } else {
            setError(true)
        }
    }

    return (
        <div className="detalle-h-mant__home__block">
            <Block
                list={data.length > 0}
                className="detalle-h-mant__comment__block"
                style={{ paddingTop: data.length > 0 ? 30 : 0 }}
            >
                {!load ? (
                    data.length === 0 ? (
                        <Empty
                            className="detalle-h-mant__comment__empty"
                            title="Sin comentarios o peticiones del huésped"
                            icon="chatFill"
                            theme="dark"
                        />
                    ) : (
                        data.map(({ comentario = "", fecha = "" }, index) => (
                            <CommentItem key={index} date={fecha} value={comentario} />
                        ))
                    )
                ) : null}
            </Block>
            {rolName !== "MONITOREO" && (
                <div>
                    <TextArea
                        description="Comentarios"
                        placeholder="Escribe un comentario..."
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                            if (error) setError(false)
                        }}
                        error={error}
                        errorHintText={"Escribe tu comentario"}
                    />
                    <PrimaryButton text="Guardar comentario" onClick={validateIsColabActive(handleSend)} />
                </div>
            )}
            {InactiveModal}
        </div>
    )
}
