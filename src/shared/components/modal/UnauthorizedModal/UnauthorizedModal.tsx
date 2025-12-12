import React from "react"

import "./UnauthorizedModal.css"
import { Modal } from "../../layout/modal/Modal"
import ModalContent from "../sections/ModalContent/ModalContent"
import IconBorder from "../../data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { Button } from "../../forms"
import ModalRow from "../sections/ModalRow/ModalRow"
import ModalFooter from "../sections/ModalFooter/ModalFooter"
import BoldedText from "../../data-display/bolded-text/BoldedText"

const UnauthorizedModal = ({ onClose, isOpen }) => {
    return (
        <Modal isCancelableOnClickOutside={false} onClose={onClose} isOpen={isOpen} width={572} withCloseButton>
            <ModalContent>
                <ModalRow style={{ alignItems: "flex-start" }} className="unauthorized-modal__container">
                    <IconBorder
                        secondaryBgColor={"var(--pale-pink)"}
                        secondaryBgDiameter={60}
                        primaryBgColor={"var(--pink-ocupado-light)"}
                        primaryBgDiameter={40}
                    >
                        <Icon
                            secondarycolor="red"
                            name={"Warning"}
                            height={24}
                            width={24}
                            color={"var(--pink-ocupado)"}
                        ></Icon>
                    </IconBorder>
                </ModalRow>
                <ModalRow style={{alignItems: "flex-start"}} className="unauthorized-modal__container">
                    <BoldedText className="unauthorized-modal__title">Acceso restringido</BoldedText>
                </ModalRow>
                <ModalRow style={{alignItems: "flex-start"}} className="unauthorized-modal__container">
                    <span className="unauthorized-modal__subtitle">No tienes permisos para continuar. Si es necesario, contacta a tu administrador</span>
                </ModalRow>
                <ModalFooter>
                    <Button style={{ width: "100%" }} text="Aceptar" onClick={onClose} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UnauthorizedModal
