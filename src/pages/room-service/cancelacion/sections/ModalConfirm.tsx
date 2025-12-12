import { useNavigate } from "react-router-dom"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { TicketItem } from "src/shared/sections/ticket/Ticket"
import "./ModalConfirm.css"

function ModalConfirm({ visible = false, onClose, orderItems }): JSX.Element {
    const navigate = useNavigate()

    const handleClose = () => {
        onClose()
        navigate("/u/room-service/ordenes", { replace: true })
    }

    return (
        <Modal
            className="cancelacion__close-modal"
            isOpen={visible}
            withCloseButton
            onClose={handleClose}
            isCancelableOnClickOutside={false}
        >
            <div className="cancelacion__confirm-modal__icon__contain cancelacion__confirm-modal__circle">
                <div className="cancelacion__confirm-modal__icon cancelacion__confirm-modal__circle">
                    <div className="cancelacion__confirm-modal__icon__cover cancelacion__confirm-modal__circle">
                        <Icon name="check" color={"var(--white)"} />
                    </div>
                </div>
            </div>
            <h5 className="cancelacion__confirm-modal__title">{"Cancelación exitosa"}</h5>
            <div className="cancelacion__confirm-modal__content">
                <TicketItem
                    className="cancelacion__confirm-modal__item"
                    label={"Monto"}
                    icon={"dollarCircle"}
                    value={orderItems[0]}
                />
                <TicketItem
                    className="cancelacion__confirm-modal__item"
                    label={"Devolución a inventario"}
                    icon={"packageFill"}
                    value={orderItems[1]}
                />
                <TicketItem
                    className="cancelacion__confirm-modal__item"
                    label={"Merma"}
                    icon={"trashFilled"}
                    value={orderItems[2]}
                />
            </div>
            <Button className="cancelacion__confirm-modal__btn" text="Aceptar" onClick={handleClose} />
        </Modal>
    )
}

export default ModalConfirm
