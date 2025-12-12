import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import "./index.css"

function CloseModal({ visible = false, editMode = false, onClose, onConfirm }): JSX.Element {
    return (
        <Modal
            className="detalle-compra__close-modal"
            style={{ padding: "24px 30px" }}
            height={230}
            isOpen={visible}
            withCloseButton
            onClose={onClose}
        >
            <div className="detalle-compra__close-modal__icon__contain">
                <div className="detalle-compra__close-modal__icon">
                    <span>{"!"}</span>
                </div>
            </div>
            <h5 className="detalle-compra__close-modal__title">{`Abandonar la orden`}</h5>
            <p className="detalle-compra__close-modal__text">{`Si decides dar clic en “Continuar”, ten en cuenta que abandonarás la orden y todos los artículos agregados se perderán.`}</p>
            <div className="detalle-compra__close-modal__buttons">
                <Button
                    className="detalle-compra__close-modal__btn"
                    text="Cancelar"
                    theme={"secondary"}
                    onClick={onClose}
                />
                <Button
                    className="detalle-compra__close-modal__btn"
                    text="Continuar"
                    onClick={() => {
                        onClose()
                        onConfirm()
                    }}
                />
            </div>
        </Modal>
    )
}

export default CloseModal
