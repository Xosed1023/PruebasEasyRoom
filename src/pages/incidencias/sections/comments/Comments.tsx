import { useEffect, useState } from "react"
import { client } from "src/graphql"
import { Button, TextBox } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { AGREGAR_COMENTARIO } from "../../incidencias-graphql/mutations/incidencia"
import { Comment } from "./Comments.types"
import "./Comments.css"
import { GET_COMENTARIOS_INCIDENCIA } from "../../incidencias-graphql/queries/incidencia"
import { getDateStringMDY } from "src/utils/date"
import { RootState } from "src/store/store"
import { useSelector } from "react-redux"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const Comments = ({ incidenciaId = "", tipoIncidencia = "" }) => {
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const [comments, setComments] = useState<Array<Comment>>([])
    const [estado, setEstado] = useState<string>("")
    const { rolName } = useProfile()
    const [message, setMessage] = useState<string>("")
    const [data, setData] = useState<any>()
    const [error, setError] = useState<boolean>(false)
    const { myProfile } = useSelector((state: RootState) => state.profile)

    useEffect(() => {
        if (incidenciaId) {
            const array: Comment[] = []
            client
                .query({
                    query: GET_COMENTARIOS_INCIDENCIA,
                    variables: { incidencia_id: incidenciaId },
                })
                .then(({ data }) => {
                    const incidencia = data.incidencias[0]
                    incidencia?.comentarios?.map((comentario) => {
                        array.push({
                            date: getDateStringMDY(comentario.fecha),
                            comment: comentario.comentario,
                        })
                    })
                    setComments([...array])
                    setEstado(incidencia?.estado)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [incidenciaId, data])

    const addComment = async () => {
        if (message) {
            // const newComment: Comment = {
            //     date: new Date().toISOString().replace(/T.*/, "").split("-").reverse().join("/"),
            //     comment: message,
            // }
            try {
                const { data } = await client.mutate({
                    mutation: AGREGAR_COMENTARIO,
                    variables: {
                        addComentarioInput: {
                            indicencia_id: incidenciaId,
                            comentario: message,
                            usuario_id: myProfile.usuario_id,
                        },
                    },
                })
                if (data) {
                    setData(data)
                    // setComments([...comments, newComment])
                    setMessage("")
                }
            } catch (e) {
                console.log(e.message)
            }
        } else {
            setError(true)
        }
    }

    return (
        <div className="comments__container">
            {comments.length > 0 ? (
                <div className="comments__container__message">
                    {comments?.map(({ date = "", comment = "" }, index) => (
                        <div className="comments__item" key={index}>
                            <div className="comments__item__date">{date}</div>
                            <div className="comments__item__detail">{comment}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="comments__empty__container">
                    <div className="comments__empty__container_icon">
                        <Icon name="chatFill" color="var(--white)" className="comments__icon"></Icon>
                    </div>
                    <p className="comments__empty__text">Sin comentarios</p>
                </div>
            )}
            {estado === "activa" &&
                (rolName !== "MANTENIMIENTO" || tipoIncidencia?.toLowerCase() === "mantenimiento") &&
                rolName !== "MONITOREO" && (
                <div className="detalle-incidencia__container-button">
                    <TextBox
                        description="Comentarios"
                        className="comment__textarea"
                        placeholder="Escribe un comentario..."
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                            setError(false)
                        }}
                        error={error}
                        errorHintText={error ? "Escribe tu comentario" : ""}
                    />
                    <Button
                        className="detalle-incidencia__button"
                        text="Guardar comentario"
                        onClick={validateIsColabActive(() => addComment())}
                    />
                </div>
            )}
            {InactiveModal}
        </div>
    )
}

export default Comments
