import React from "react"
import SnackBar from "src/shared/components/data-display/SnackBar/SnackBar"

export interface MesajeInfoProps {
    sendMesaje: {
        texto: string
        success: boolean
    }
    closeModal: () => void
    isOpen?: boolean
    title?: string
    titleError?: string
}

const MesajeInfo = ({ sendMesaje, closeModal, isOpen, title, titleError }: MesajeInfoProps) => {
    return (
        <SnackBar
            title={`${
                title
                    ? title
                    : sendMesaje.success
                    ? "Gasto registrado"
                    : titleError
                    ? titleError
                    : "Error al guardar los cambios"
            }`}
            status={sendMesaje.success ? "success" : "error"}
            isOpen={isOpen}
            onClose={() => closeModal}
        >
            <p className="reservas-screen_snackbar_content">{sendMesaje.texto}</p>
        </SnackBar>
    )
}
export default MesajeInfo
