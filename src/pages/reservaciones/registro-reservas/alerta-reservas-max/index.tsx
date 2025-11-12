import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import "./index.css"

function AlertReservas({ visible = false, onClose, onConfirm, date = new Date().toISOString() }): JSX.Element {
    return (
        <Modal className="reservas__alert-max" height={230} isOpen={visible} withCloseButton onClose={onClose}>
            <div className="reservas__alert-max__icon__contain">
                <div className="reservas__alert-max__icon">
                    <span>{"!"}</span>
                </div>
            </div>
            <h5 className="reservas__alert-max__title">{"Máximo de reservas permitido alcanzado"}</h5>
            <BoldedText className="reservas__alert-max__text">{`Has alcanzado el límite de reservas para el **${formatDateComplitSlash(date)}**. Ajusta el límite de habitaciones en el módulo de configuración.`}</BoldedText>
            <div className="reservas__alert-max__btn-group">
                <Button className="reservas__alert-max__btn" text="Cancelar" theme={"secondary"} onClick={onClose} />
                <Button className="reservas__alert-max__btn" text="Continuar" onClick={onConfirm} />
            </div>
        </Modal>
    )
}

export default AlertReservas
