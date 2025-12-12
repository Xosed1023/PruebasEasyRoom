import React from "react"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"

import "./ModalFingerprintFinalStage.css"
import { Button } from "src/shared/components/forms"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"

const ModalFingerprintFinalStage = ({
    colaboradorName,
    onConfirm,
}: {
    colaboradorName: string
    onConfirm: () => void
}) => {
    return (
        <ModalContent>
            <ModalRow />
            <ModalRow>
                <p className="modal-fingerprint-final-stage__title">¡Huella capturada exitosamente</p>
                <p className="modal-fingerprint-final-stage__subtitle">
                    La huella digital de
                    <span className="modal-fingerprint-final-stage__subtitle--bold"> {colaboradorName} </span>
                    se ha registrado correctamente
                </p>
            </ModalRow>
            <ModalRow>
                <img src={require(`src/assets/png/fingerprint-modal/huella5.png`)} alt="" />
            </ModalRow>
            <ModalFooter>
                <Button className="modal-fingerprint-final-stage__button" onClick={onConfirm} text="Continuar" />
            </ModalFooter>
        </ModalContent>
    )
}

export default ModalFingerprintFinalStage
