import { useNavigate } from "react-router-dom"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import "./index.css"

function CloseModal({ visible = false, onClose, title = "" }): JSX.Element {
    const navigate = useNavigate()
    return (
        <Modal className="product-form__close-modal" height={230} isOpen={visible} withCloseButton onClose={onClose}>
            <div className="product-form__close-modal__icon__contain">
                <div className="product-form__close-modal__icon">
                    <span>{"!"}</span>
                </div>
            </div>
            <h5 className="product-form__close-modal__title">{title}</h5>
            <p className="product-form__close-modal__text">
                {
                    "Si decides dar clic en 'Continuar', ten en cuenta que abandonarás el registro y toda la información ingresada se perderá."
                }
            </p>
            <div className="product-form__close-modal__buttons">
                <Button
                    className="product-form__close-modal__btn"
                    text="Cancelar"
                    theme={"secondary"}
                    onClick={onClose}
                />
                <Button
                    className="product-form__close-modal__btn"
                    text="Continuar"
                    onClick={() => {
                        onClose()
                        navigate(-1)
                    }}
                />
            </div>
        </Modal>
    )
}

export default CloseModal
