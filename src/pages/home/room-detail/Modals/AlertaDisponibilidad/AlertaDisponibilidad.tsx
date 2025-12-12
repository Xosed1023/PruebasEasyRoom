import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import "./AlertaDisponibilidad.css"
import { Button } from "src/shared/components/forms"

const AlertaDisponibilidad = ({ isOpen, onClose, onClick }: ModalProps) => {
    return (
        <Modal
            height={236}
            width={572}
            withCloseButton
            isOpen={isOpen}
            isCancelableOnClickOutside={true}
            onClose={() => {
                onClose?.()
            }}
        >
            <div className="modal-alert">
                <div className="modal-alert__header">
                    <IconBorder
                        secondaryBgColor={"#fef4f3"}
                        secondaryBgDiameter={60}
                        primaryBgColor={"#f6bec2"}
                        primaryBgDiameter={40}
                    >
                        <Icon name={"Warning"} height={20} width={20} color={"#eb5758"}></Icon>
                    </IconBorder>
                </div>
                <p className="modal-alert__title">Alerta de disponibilidad de habitaciones </p>
                <span className="modal-alert__text">
                    Tienes reservas pendientes de asignación de habitación. Al continuar,{" "}
                    <span className="modal-alert__text--bold">
                        podrías quedarte sin habitaciones disponibles para esas reservas.{" "}
                    </span>
                    ¿Deseas continuar?
                </span>
                <div className="modal-alert__divider"></div>
                <div className="modal-alert__buttons">
                    <Button
                        className="modal-alert__button"
                        theme={"secondary"}
                        text={"Cancelar"}
                        onClick={() => onClose?.()}
                    />
                    <Button
                        className="modal-alert__button"
                        text={"Continuar"}
                        onClick={() => {
                            onClick?.()
                        }}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default AlertaDisponibilidad
