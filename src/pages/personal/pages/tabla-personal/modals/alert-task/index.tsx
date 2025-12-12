import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import "./index.css"

function AlertTaskModal({ visible = false, onClose, name = "" }): JSX.Element {
    return (
        <Modal className="personal__alert-modal" height={230} isOpen={visible} withCloseButton onClose={onClose}>
            <div className="personal__alert-modal__icon__contain">
                <div className="personal__alert-modal__icon">
                    <span>{"!"}</span>
                </div>
            </div>
            <h5 className="personal__alert-modal__title">{"Tarea en curso"}</h5>
            <BoldedText className="personal__alert-modal__text">{`**${name} tiene una tarea en curso.** Podrás desactivar su turno, una vez que la tarea se haya finalizado.`}</BoldedText>
            <Button className="personal__alert-modal__btn" text="Aceptar" onClick={onClose} />
        </Modal>
    )
}

export default AlertTaskModal
