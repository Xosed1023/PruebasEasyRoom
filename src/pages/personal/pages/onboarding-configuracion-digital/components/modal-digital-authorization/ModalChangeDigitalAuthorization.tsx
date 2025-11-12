import React, { useState, useCallback, useEffect } from "react"

import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import OptionSelector from "src/shared/components/data-display/optionSelector/OptionSelector"
import ModalPin from "../modal-pin/ModalPin"
import ModalFingerprint from "../modal-fingerprint/ModalFingerprint"
import "./ModalChangeDigitalAuthorization.css"

import { useDigitalAuth } from "src/pages/personal/pages/onboarding-configuracion-digital/hooks/useDigitalAuth"

interface ModalChangeDigitalAuthorizationProps {
    isOpen: boolean
    onClose: () => void
    onAuthorizationSave: (fingerprints: string[]) => void
    buttonTextPin?: string
    onButtonClickPin?: () => void
    colaboradorName: string
}

const ModalChangeDigitalAuthorization: React.FC<ModalChangeDigitalAuthorizationProps> = ({ isOpen, onClose, onAuthorizationSave, colaboradorName }) => {
    const [selectedOption, setSelectedOption] = useState<string>("")

    const {
        isModalRegistroPinOpen,
        isModalFingerprintOpen,
        openModalPin,
        openModalPinFingerprint,
        handlePinSave,
        setIsModalRegistroPinOpen,
        setIsModalFingerprintOpen,
    } = useDigitalAuth({
        mode: "change",
        onClose,
        colaboradorNameSelected: colaboradorName
    })

    const options = [
        { label: "Cambio de PIN", value: "pin" },
        { label: "Cambio de PIN y huella dactilar", value: "pin_and_fingerprint" },
    ]

    const handleOptionChange = (value: string) => {
        setSelectedOption(value)

        if (value === "pin") {
            openModalPin()
        } else if (value === "pin_and_fingerprint") {
            openModalPinFingerprint()
        }
    }

    const resetModalStates = useCallback(() => {
        setSelectedOption("")
        setIsModalRegistroPinOpen(false)
        setIsModalFingerprintOpen(false)
    }, [setIsModalRegistroPinOpen, setIsModalFingerprintOpen])

    useEffect(() => {
        if (!isOpen) {
            resetModalStates()
        }
    }, [isOpen, resetModalStates])

    return (
        <Modal isOpen={isOpen} withCloseButton={true} onClose={onClose} width="572px" withBackButton onBack={onClose}>
            <div className="modal-content">
                <div className="modal-content__general">
                    <div className="modal-content__header">
                        <div className="modal-content__icon-outer">
                            <div className="modal-content__icon">
                                <Icon name="editFill" />
                            </div>
                        </div>
                    </div>
                    <h2 className="modal-content__title">Cambiar autorización digital</h2>
                    <p className="modal-content__description">Selecciona la opción que prefieras.</p>
                    <div className="modal-change-digital-authorization">
                        <OptionSelector
                            options={options}
                            selectedOption={selectedOption}
                            onOptionChange={handleOptionChange}
                        />
                    </div>
                </div>
                <div className="modal__back" onClick={onClose}>
                    <Icon name="arrowLeft" color="var(--deep-purple)" />
                    <span className="modal__back-text">Regresar</span>
                </div>
            </div>
            <ModalPin
                isOpen={isModalRegistroPinOpen}
                onClose={() => {
                    setIsModalRegistroPinOpen(false)
                    onClose()
                }}
                onPinSave={handlePinSave}
                titlePin="Cambiar PIN"
                colaboradorName={colaboradorName}
            />

            <ModalFingerprint
                isOpen={isModalFingerprintOpen}
                colaboradorName={colaboradorName}
                mode="edit"
                onClose={() => setIsModalFingerprintOpen(false)}
                titleFingerprint="Cambiar huella dactilar"
                onButtonClickFingerprint={(fingerprints) => {
                    onAuthorizationSave(fingerprints)
                    setIsModalRegistroPinOpen(true)
                }}
            />

        </Modal>
    )
}

export default ModalChangeDigitalAuthorization
