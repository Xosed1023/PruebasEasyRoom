import React from "react"

import "./ColabInactiveModal.css"
import { Modal } from "../../layout/modal/Modal"
import ModalContent from "../sections/ModalContent/ModalContent"
import IconBorder from "../../data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { Button } from "../../forms"
import ModalRow from "../sections/ModalRow/ModalRow"
import ModalFooter from "../sections/ModalFooter/ModalFooter"
import BoldedText from "../../data-display/bolded-text/BoldedText"

const ColabInactiveModal = ({ onClose, isOpen }) => {
    return (
        <Modal isCancelableOnClickOutside={false} onClose={onClose} isOpen={isOpen} width={572} withCloseButton>
            <ModalContent>
                <ModalRow style={{ alignItems: "flex-start" }} className="colab-inactive-modal__container">
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
                <ModalRow style={{alignItems: "flex-start"}} className="colab-inactive-modal__container">
                    <BoldedText className="colab-inactive-modal__title">Acceso restringido: Perfil inactivo</BoldedText>
                </ModalRow>
                <ModalRow style={{alignItems: "flex-start"}} className="colab-inactive-modal__container">
                    <span className="colab-inactive-modal__subtitle">Actualmente tu perfil no se encuentra activo en el sistema, por lo que no podrás realizar ninguna acción hasta que tu perfil sea activado</span>
                    <span className="colab-inactive-modal__subtitle">Para más información, contacta a tu administrador o soporte</span>
                </ModalRow>
                <ModalFooter>
                    <Button style={{ width: "100%" }} text="Aceptar" onClick={onClose} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ColabInactiveModal
