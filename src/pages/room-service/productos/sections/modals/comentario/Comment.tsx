import { useEffect, useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Empty from "src/shared/components/data-display/empty/Empty"
import { Button, TextBox } from "src/shared/components/forms"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "./index.css"

interface Props {
    isOpen: boolean
    onClose: () => void
    onChange: (value: string) => void
    defaultValue?: string
    description: string
}

function ModalComment({ isOpen = false, onClose, onChange, defaultValue = "", description = "" }: Props): JSX.Element {
    const [value, setValue] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    const editMode = defaultValue

    const { showSnackbar } = useSnackbar()

    const handle = () => {
        if (value) {
            setValue("")
            onChange(value)
            onClose()
            showSnackbar({
                title: !editMode ? "Comentario agregado" : "Comentario actualizado",
                text: !editMode
                    ? `Agregaste un comentario a **${description}**.`
                    : `Se actualizó el comentario de **${description}**.`,
                status: "success",
            })
        } else {
            setError(true)
        }
    }

    const handleRemove = () => {
        setValue("")
        onChange("")
        onClose()
    }

    useEffect(() => {
        if (defaultValue) setValue(defaultValue)
    }, [defaultValue])

    return (
        <Modal className="room-service__modal-comment" isOpen={isOpen} onClose={onClose} withCloseButton={true}>
            <div className="room-service__modal-comment__contain">
                <Empty
                    className="room-service__modal-comment__empty"
                    title={"Agregar comentario"}
                    theme={"light"}
                    icon={"chatLeft"}
                />
                <p className="room-service__modal-comment__description">{description}</p>
                <TextBox
                    placeholder="Escribe algo..."
                    className="room-service__modal-comment__textarea"
                    error={error}
                    value={value}
                    errorHintText={"Escribe un comentario"}
                    onChange={(e) => {
                        setValue(e.target.value)
                        if (error) setError(false)
                    }}
                    autoFocus={true}
                />
                {!editMode ? (
                    <Button
                        className="room-service__modal-comment__button"
                        text={"Agregar comentario"}
                        onClick={handle}
                    />
                ) : (
                    <div className="room-service__modal-comment__grid">
                        <Button
                            theme={"secondary"}
                            className="room-service__modal-comment__button"
                            text={"Borrar comentario"}
                            onClick={handleRemove}
                        />
                        <Button
                            className="room-service__modal-comment__button"
                            text={"Guardar comentario"}
                            onClick={handle}
                        />
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default ModalComment
