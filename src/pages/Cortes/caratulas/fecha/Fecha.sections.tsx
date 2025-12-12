import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "src/shared/icons"
import corteDiaOpener from "src/shared/openers/corteDiaOpener"
import Alerta from "../../Components/Modals/PagosPendientes/AlertaSimple"
import { useEfectivo } from "../../Sections/ResumenTurno/hooks/useEfectivo"

export const CellActions = ({ corteId = "", item }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const navigate = useNavigate()

    const { onClearEfectivo } = useEfectivo()

    const openned = !item?.fecha_cierre
    const pagos_pendientes = Number(item?.total_pagos_pendientes || 0) > 0

    const onCerrarCorte = () => {
        onClearEfectivo()
        navigate(`/u/cortes/resumen/${corteId}`)
    }

    return (
        <div className="caratulas-f__cell">
            <div
                className="caratulas-f__icon-btn"
                style={{ marginRight: 12 }}
                onClick={() => {
                    corteDiaOpener({
                        stateCorteHistorial: {
                            corte_id: corteId,
                        },
                    })
                }}
            >
                <Icon name={"printer"} height={16} width={16} color={"var(--primary)"} />
            </div>
            {openned ? (
                <div
                    className="caratulas-f__link"
                    onClick={() => {
                        if (pagos_pendientes) {
                            setVisible(true)
                            return
                        }

                        onCerrarCorte()
                    }}
                >
                    {"Cerrar"}
                </div>
            ) : (
                <div className="caratulas-f__icon-btn" onClick={onCerrarCorte}>
                    <Icon name={"eye"} height={16} width={16} color={"var(--primary)"} />
                </div>
            )}
            <Alerta visible={visible} onClose={() => setVisible(false)} onConfirm={onCerrarCorte} />
        </div>
    )
}
