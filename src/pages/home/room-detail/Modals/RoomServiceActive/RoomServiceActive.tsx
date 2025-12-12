import React from "react"

import "./RoomServiceActive.css"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { PrimaryButton } from "../../sections/elements/Elements"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"

const RoomServiceActive = ({ isOpen, onClose }: ModalProps) => {
    const { showMiniSnackbar } = useMiniSnackbar()

    const onConfirm = () => {
        showMiniSnackbar({
            title: "Cambio de habitacion",
            status: "success",
            text: "Se realizó el cambio de la habitación **Suite Villa 301** a la habitación **Suite Villa 303.** El room service se entregará a la nueva habitación",
        })
        onClose?.()
    }

    return (
        <Modal
            height={493}
            width={742}
            withCloseButton
            isOpen={isOpen}
            isCancelableOnClickOutside={false}
            onClose={() => onClose?.()}
        >
            <div className="modal__room-service-active--wrapper">
                <div className="modal__room-service-active">
                    <IconBorder primaryBgColor="var(--fondo--close)" primaryBgDiameter={120}>
                        <Icon name="restaurantFill" color="var(--purple-drawer-primario)" height={66} width={66} />
                    </IconBorder>
                    <p className="modal__room-service-active__title">Ordenes pendientes de entrega</p>
                    <span className="modal__room-service-active__description">
                        Al continuar, se hará el cambio de habitación de{" "}
                        <span className="modal__room-service-active__description--bold">{"Suite Villa 301"}</span> a{" "}
                        <span className="modal__room-service-active__description--bold">{"Suite Villa 303"}</span> con{" "}
                        <span className="modal__room-service-active__description--bold">
                            2 ordenes activas de room service
                        </span>{" "}
                        con un total de <span className="modal__room-service-active__description--bold">$2,000</span>
                    </span>
                </div>
                <PrimaryButton text="Hacer cambio de habitación" onClick={onConfirm} />
            </div>
        </Modal>
    )
}

export default RoomServiceActive
