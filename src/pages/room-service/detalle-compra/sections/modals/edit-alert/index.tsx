import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import "./index.css"

function CloseModal({ visible = false, onClose }): JSX.Element {
    return (
        <Modal
            className="detalle-compra__alert-edit-modal"
            height={230}
            isOpen={visible}
            withCloseButton
            onClose={onClose}
        >
            <div className="detalle-compra__alert-edit-modal__icon__contain">
                <div className="detalle-compra__alert-edit-modal__icon">
                    <div className="detalle-compra__alert-edit-modal__icon-cover">
                        <Icon color={"var(--white)"} name={"alertFill"} />
                    </div>
                </div>
            </div>
            <h5 className="detalle-compra__alert-edit-modal__title">{"No se pueden aplicar los cambios"}</h5>
            <p className="detalle-compra__alert-edit-modal__text">
                {
                    "No puedes eliminar todos los productos de la orden de Room service. Asegúrate de que la orden contenga al menos un producto para continuar."
                }
            </p>
            <div className="detalle-compra__alert-edit-modal__buttons">
                <Button className="detalle-compra__alert-edit-modal__btn" text="Aceptar" onClick={onClose} />
            </div>
        </Modal>
    )
}

export default CloseModal
