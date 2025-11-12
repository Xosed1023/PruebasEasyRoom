import React, { useEffect } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"

import "./ModalPin.css"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { useGenerarPinQuery } from "src/gql/schema"

interface ModalPinProps {
    isOpen: boolean
    onClose: () => void
    onPinSave: () => void
    titlePin?: string
    colaboradorName: string
    onButtonClickPin?: () => void
}

const ModalPin: React.FC<ModalPinProps> = ({
    isOpen,
    onClose,
    onPinSave,
    titlePin = "Creación de PIN para operaciones",
    colaboradorName,
    onButtonClickPin,
}) => {
    const { data } = useGenerarPinQuery()

    useEffect(() => {
        if (data?.generar_pin && isOpen) {
            sessionStorage.setItem("PINData", data.generar_pin)
        }
    }, [data, isOpen])

    const handlePinSave = () => {
        onClose()
        onPinSave()
        onButtonClickPin && onButtonClickPin()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="572px">
            <ModalContent className="modal-pin-content">
                <ModalRow className="modal-pin-header">
                    <IconBorder
                        primaryBgColor="var(--purple-drawer-primario)"
                        primaryBgDiameter={32}
                        secondaryBgDiameter={64}
                        secondaryBgColor=" var(--fondo-close)"
                    >
                        <Icon name="shieldCheck" />
                    </IconBorder>
                    <h2 className="modal-content__title">{titlePin}</h2>
                    <p className="modal-content__description">
                        PIN asignado a <span className="modal-content__description__bold">{colaboradorName}:</span>{" "}
                        úselo para autorizar todas las operaciones dentro de Easyroom
                    </p>
                </ModalRow>

                <ModalRow>
                    <p className="modal-content__action-pin">{data?.generar_pin || ""}</p>
                </ModalRow>
                <ModalRow>
                    <p className="modal-content__action-pin__description">
                        El PIN se enviará al correo electrónico registrado del colaborador
                    </p>
                </ModalRow>
                <ModalFooter>
                    <Button onClick={handlePinSave} className="modal-content__action-button" text="Aceptar" />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalPin
