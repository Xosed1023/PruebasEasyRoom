import { Modal } from "src/shared/components/layout/modal/Modal"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import { Button } from "src/shared/components/forms"
import "./index.css"

export type BaseProps = {
    visible: boolean
    onClose: () => void
    onConfirm: () => void
}

interface AlertProps extends BaseProps {
    title: string
    description: string
    withCancelOption?: boolean
    confirmLabel?: string
    cancelLabel?: string
}

function AlertBase({
    title = "",
    description = "",
    confirmLabel = "Continuar",
    cancelLabel = "Cancelar",
    withCancelOption = true,
    visible = false,
    onClose,
    onConfirm,
}: AlertProps): JSX.Element {
    return (
        <Modal
            className="cortes__alert-modal"
            style={{ padding: "24px 30px" }}
            height={230}
            isOpen={visible}
            withCloseButton
            onClose={onClose}
        >
            <div className="cortes__alert-modal__icon__contain">
                <div className="cortes__alert-modal__icon">
                    <span>{"!"}</span>
                </div>
            </div>
            <h5 className="cortes__alert-modal__title">{title}</h5>
            <BoldedText color={"var(--placeholder)"} className="cortes__alert-modal__text">
                {description}
            </BoldedText>
            <div
                className={`cortes__alert-modal__buttons${
                    withCancelOption ? " cortes__alert-modal__buttons-grid" : ""
                }`}
            >
                {withCancelOption && (
                    <Button
                        className="cortes__alert-modal__btn"
                        text={cancelLabel}
                        theme={"secondary"}
                        onClick={onClose}
                    />
                )}
                <Button
                    className="cortes__alert-modal__btn"
                    text={confirmLabel}
                    onClick={() => {
                        onConfirm()
                    }}
                />
            </div>
        </Modal>
    )
}

export default AlertBase
