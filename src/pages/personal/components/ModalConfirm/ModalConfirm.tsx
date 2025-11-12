import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import "./ModalConfirm.css"

type Props = {
    onClose?: () => void
    visible: boolean
    onConfirm: () => void
    text: string
}

function ModalConfirm({ onClose, onConfirm, visible = false, text = "" }: Props): JSX.Element {
    return (
        <Modal withCloseButton className="personal-modal-c" isOpen={visible} onClose={onClose}>
            <div className="personal-modal-c__main">
                <div className="personal-modal-c__icon-cover">
                    <div className="personal-modal-c__icon">
                        <span>{"!"}</span>
                    </div>
                </div>
                <p className="personal-modal-c__title">{"Cierre de turno de personal"}</p>
                <BoldedText className="personal-modal-c__text">{text}</BoldedText>
            </div>
            <div className="personal-modal-c__footer">
                <Button
                    className="personal-modal-c__btn"
                    type={"button"}
                    theme={"secondary"}
                    text={"Cancelar"}
                    onClick={onClose}
                />
                <Button className="personal-modal-c__btn" type={"button"} text={"Cerrar turno"} onClick={onConfirm} />
            </div>
        </Modal>
    )
}

export default ModalConfirm
