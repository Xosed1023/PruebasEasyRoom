import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import "./EditarReserva.css"

function EditarReserva({ visible = false, editMode = false, onClose, onConfirm }): JSX.Element {
    return (
        <Modal
            className="modal__editar-renta-reserva"
            style={{ padding: "24px 30px" }}
            height={230}
            isOpen={visible}
            withCloseButton
            onClose={onClose}
        >
            <div className="modal__editar-renta-reserva__icon__contain">
                <div className="modal__editar-renta-reserva__icon">
                    <span>{"!"}</span>
                </div>
            </div>
            <h5 className="modal__editar-renta-reserva__title">{`Edición de reserva asignada`}</h5>
            <p className="modal__editar-renta-reserva__text">{`Si decides dar clic en “Continuar”, ten en cuenta que deberás asignar nuevamente la reserva a una habitación.`}</p>
            <div className="modal__editar-renta-reserva__buttons">
                <Button
                    className="modal__editar-renta-reserva__btn"
                    text="Cancelar"
                    theme={"secondary"}
                    onClick={onClose}
                />
                <Button
                    className="modal__editar-renta-reserva__btn"
                    text="Continuar con edición"
                    onClick={() => {
                        onClose()
                        onConfirm()
                    }}
                />
            </div>
        </Modal>
    )
}

export default EditarReserva
