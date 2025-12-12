import { useNavigate } from "react-router-dom"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { TicketItem } from "src/shared/sections/ticket/Ticket"
import "./index.css"

type ConfirmModalProps = {
    visible: boolean
    onClose: () => void
    title: string
    description: string
    items: any[]
}

function ConfirmModal({
    visible = false,
    onClose,
    title = "",
    description = "",
    items = [],
}: ConfirmModalProps): JSX.Element {
    const navigate = useNavigate()

    const handleClose = () => {
        onClose()
        navigate(-1)
    }

    return (
        <Modal
            className="product-form__confirm-modal"
            isOpen={visible}
            withCloseButton
            onClose={handleClose}
            isCancelableOnClickOutside={false}
        >
            <div className="product-form__confirm-modal__icon__contain product-form__confirm-modal__circle">
                <div className="product-form__confirm-modal__icon product-form__confirm-modal__circle">
                    <div className="product-form__confirm-modal__icon__cover product-form__confirm-modal__circle">
                        <Icon name="check" color={"var(--white)"} />
                    </div>
                </div>
            </div>
            <h5 className="product-form__confirm-modal__title">{title}</h5>
            <h5 className="product-form__confirm-modal__description">{description}</h5>
            <div className="product-form__confirm-modal__content">
                {items.map((item, index) => (
                    <TicketItem
                        key={index}
                        className="product-form__confirm-modal__item"
                        label={item?.label}
                        icon={item?.icon}
                        value={item?.value}
                    />
                ))}
            </div>
            <Button className="product-form__confirm-modal__btn" text="Aceptar" onClick={handleClose} />
        </Modal>
    )
}

export default ConfirmModal
