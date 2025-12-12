import React from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import "./Impresion.css"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"

const Impresion = ({
    openImpresion,
    setOpenImpresion,
}: {
    openImpresion: boolean
    setOpenImpresion: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <Modal
            isOpen={openImpresion}
            onClose={() => setOpenImpresion(false)}
            width={600}
            withCloseButton
            isCancelableOnClickOutside={true}
            className="modal-cortes-impresion"
        >
            <HeaderIcon title="Impresión de pre-corte" icon="printer" />
            <p className="modal-impresion-subtitle">Realiza la impresión de todos los movimientos efectuados en el turno hasta el momento</p>
            <div className="modal-impresion-info-container">
                <div className="modal-impresion-info-card">
                    <Icon name="calendarFill" />
                    <div className="modal-impresion-info">
                        <p className="modal-impresion-info-label">Fecha</p>
                        <p className="modal-impresion-info-value">Nov, 11 2023 </p>
                    </div>
                </div>
                <div className="modal-impresion-info-card">
                    <Icon name="bookMark" />
                    <div className="modal-impresion-info">
                        <p className="modal-impresion-info-label">Turno</p>
                        <p className="modal-impresion-info-value">Matutino </p>
                    </div>
                </div>
            </div>
            <Button text="Imprimir" className="modal-impresion-button" onClick={() => setOpenImpresion(false)} />
        </Modal>
    )
}

export default Impresion
