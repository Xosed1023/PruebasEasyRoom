import React from "react"
import { RegistroDePagoReservacion } from "src/pages/reservaciones/registro-reservas/registro-de-pago-modal/RegistroDePagoReservacion"
import "./RegisterPay.css"

export const RegisterPay = ({ id, onClose }: { id: string; onClose: () => void }) => {
    return (
        <>
            <RegistroDePagoReservacion reserva_id={id} onClose={() => onClose()} />
            <span onClick={() => onClose()} className="reservas-screen__drawer-modal-add-pa__item">
                Registrar pago
            </span>
        </>
    )
}
