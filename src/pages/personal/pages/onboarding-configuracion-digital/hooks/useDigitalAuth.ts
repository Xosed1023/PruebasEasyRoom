import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useSnackbar from "src/shared/hooks/useSnackbar"

export const useDigitalAuth = ({
    mode,
    colaboradorNameSelected,
    onClose,
}: {
    mode: "onboarding" | "change"
    onClose?: () => void
    colaboradorNameSelected: string
}) => {
    const [isModalRegistroPinOpen, setIsModalRegistroPinOpen] = useState(false)
    const [isModalFingerprintOpen, setIsModalFingerprintOpen] = useState(false)
    const [pinAndFingerprintFlow, setPinAndFingerprintFlow] = useState(false)
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()

    const openModalPin = () => {
        setPinAndFingerprintFlow(false)
        setIsModalRegistroPinOpen(true)
    }

    const openModalPinFingerprint = () => {
        setPinAndFingerprintFlow(true)
        setIsModalFingerprintOpen(true)
    }

    const handlePinSave = () => {
        setIsModalRegistroPinOpen(false)

        if (mode === "onboarding") {
            navigate(-1)
            showSnackbar({
                status: "success",
                title: "Registro de PIN",
                text: `Se registró el PIN de **${colaboradorNameSelected}** exitosamente`,
            })
        } else if (mode === "change") {
            if (!pinAndFingerprintFlow) {
                return
            } else {
                showSnackbar({
                    status: "success",
                    title: "Cambio de PIN",
                    text: `Se actualizó el PIN de **${colaboradorNameSelected}** exitosamente`,
                })
            }
        }
    }

    const handleFingerprintSave = () => {
        setIsModalRegistroPinOpen(true)
        setIsModalFingerprintOpen(false)
    }

    const handleAuthorizationClose = () => {
        if (mode === "onboarding") {
            navigate(-1)
        } else if (mode === "change" && onClose) {
            onClose()
        }

        if (pinAndFingerprintFlow) {
            showSnackbar({
                status: "success",
                title:
                    mode === "onboarding"
                        ? "Registro de PIN y huella de autorización"
                        : "Reestablecimiento de huella y/o PIN",
                text: `Se registraron el PIN y huella para **${colaboradorNameSelected}** exitosamente`,
            })
        } else {
            showSnackbar({
                status: "success",
                title: mode === "onboarding" ? "Registro de PIN" : "Cambio de PIN",
                text: `Se registró el PIN de **${colaboradorNameSelected}** exitosamente`,
            })
        }
    }

    return {
        isModalRegistroPinOpen,
        isModalFingerprintOpen,
        pinAndFingerprintFlow,
        openModalPin,
        openModalPinFingerprint,
        handlePinSave,
        handleFingerprintSave,
        handleAuthorizationClose,
        colaboradorNameSelected,
        setIsModalRegistroPinOpen,
        setIsModalFingerprintOpen,
    }
}
