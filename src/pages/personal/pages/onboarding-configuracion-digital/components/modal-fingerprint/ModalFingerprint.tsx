import { useState, useEffect } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import "./ModalFingerprint.css"
import useFingerprint from "src/shared/hooks/useFingerprint"
import {
    UareUFingerprintAquiredQualityReport,
    UareUFingerprintSample,
} from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import ModalFingerprintFinalStage from "./modal-fingerprint-final-stage/ModalFingerprintFinalStage"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import { FingerprintSampleData } from "./fingerprint.interface"

interface ModalFingerprintProps {
    isOpen: boolean
    onClose: () => void
    titleFingerprint?: string
    descriptionFingerprint?: string
    onButtonClickFingerprint?: (fingerprints: string[]) => void
    colaboradorName: string
    mode: "edit" | "register"
}

const ModalFingerprint: React.FC<ModalFingerprintProps> = ({
    isOpen,
    onClose,
    titleFingerprint = "Registro de huella dactilar",
    descriptionFingerprint = "Coloca tu huella en el lector para registrarla en el sistema.",
    onButtonClickFingerprint,
    colaboradorName,
    mode,
}) => {
    const [fingerprints, setFingerprints] = useState<FingerprintSampleData[]>([])
    const [validFingerprint, setvalidFingerprint] = useState(true)

    const [currentStage, setCurrentStage] = useState(0)

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        if (!isOpen) {
            return
        }
        setCurrentStage((cs) => cs + 1)
        setFingerprints((v) => {
            if (validFingerprint) {
                return [...v, JSON.parse(fingerprint.samples)?.[0]]
            }
            return v
        })
    }

    const onAcquisitionQualityReport = (v: UareUFingerprintAquiredQualityReport) => {
        if (!isOpen) {
            return
        }
        if (v.quality === 0) {
            return setvalidFingerprint(true)
        }
        return setvalidFingerprint(false)
    }

    const { startAcquisition, stopAcquisition } = useFingerprint({
        client: "UareU",
        onAcquisition,
        onAcquisitionQualityReport,
    })

    useEffect(() => {
        setFingerprints([])
        if (isOpen) {
            return startAcquisition()
        }
        stopAcquisition()
    }, [isOpen])

    useEffect(() => {
        if (currentStage >= 4) {
            stopAcquisition()
        }
    }, [currentStage])

    const stages = [
        {
            image: "huella1.png",
            text: "Repite esta acción hasta concluir el registro",
        },
        {
            image: "huella2.png",
            text: "Vuelve a colocar el mismo dedo en el lector",
        },
        {
            image: "huella3.png",
            text: "Coloca nuevamente el dedo en el lector, variando un poco la posición",
        },
        {
            image: "huella4.png",
            text: "Coloca tu huella por última vez para finalizar el registro",
        },
    ]

    useEffect(() => {
        if (!isOpen) {
            setCurrentStage(0)
            setvalidFingerprint(true)
        }
    }, [isOpen, currentStage])

    useEffect(() => {
        if(fingerprints.length === 4) {
            if(mode === "register") {
                sessionStorage.setItem("fingerprintData", JSON.stringify(fingerprints.map(f => f.Data)))
            }
        }
    }, [fingerprints])
    

    return (
        <Modal
            isOpen={isOpen}
            withCloseButton={true}
            onClose={() => {
                if(fingerprints.length === 4) {
                    onButtonClickFingerprint?.(fingerprints.map(f => f.Data))
                }
                onClose()
            }}
            width="572px"
            height="416px"
            isCancelableOnClickOutside={false}
        >
            {currentStage < 4 ? (
                <ModalContent style={{ justifyContent: "center" }}>
                    <ModalRow>
                        <IconBorder
                            primaryBgColor="var(--purple-drawer-primario)"
                            primaryBgDiameter={32}
                            secondaryBgDiameter={64}
                            secondaryBgColor=" var(--fondo-close)"
                        >
                            <Icon name="shieldCheck" />
                        </IconBorder>
                        <h2 className="modal-content__title">{titleFingerprint}</h2>
                        <p className="modal-content__description">{descriptionFingerprint}</p>
                    </ModalRow>
                    <ModalRow>
                        <img
                            src={require(`src/assets/png/fingerprint-modal/${stages[currentStage].image}`)}
                            alt="Registro de huella"
                            className="modal-content__fingerprint-image"
                        />
                        {!validFingerprint && (
                            <p className="modal-content__fingerprint-error">
                                Captura tu huella nuevamente para continuar
                            </p>
                        )}
                    </ModalRow>
                    <ModalRow style={{ marginTop: "24px" }}>
                        <p className="modal-content__fingerprint-text">{stages[currentStage].text}</p>
                    </ModalRow>
                </ModalContent>
            ) : (
                <ModalFingerprintFinalStage
                    colaboradorName={colaboradorName}
                    onConfirm={() => {
                        onClose()
                        onButtonClickFingerprint?.(fingerprints.map(f => f.Data))
                    }}
                />
            )}
        </Modal>
    )
}

export default ModalFingerprint
