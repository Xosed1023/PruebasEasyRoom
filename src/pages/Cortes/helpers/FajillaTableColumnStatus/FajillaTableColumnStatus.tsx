import React from "react"
import { EstatusFajillas } from "src/gql/schema"

import "./FajillaTableColumnStatus.css"

const FajillaTableColumnStatus = ({
    status,
    onLink,
}: {
    status: EstatusFajillas | "Pendiente"
    onLink: () => void
}) => {
    const setEstadoFajilla = () => {
        switch (status) {
            case EstatusFajillas.Creada:
                return (
                    <div className="fajilla__table-column__status creada">
                        <span className="fajilla__table-column__status__label creada">Creado</span>
                    </div>
                )
            case EstatusFajillas.Recibida:
                return (
                    <div className="fajilla__table-column__status recibida">
                        <span className="fajilla__table-column__status__label recibida">Recibido</span>
                    </div>
                )
            case EstatusFajillas.Rechazada:
                return (
                    <div className="fajilla__table-column__status rechazada">
                        <span className="fajilla__table-column__status__label rechazada">Rechazado</span>
                    </div>
                )
            case EstatusFajillas.RecibirFajilla:
                return (
                    <div className="fajilla__table-column__status recibir" onClick={onLink}>
                        <span className="fajilla__table-column__status__label recibir">Recibir retiro de efectivo</span>
                    </div>
                )
            case EstatusFajillas.Cancelada:
                return (
                    <div className="fajilla__table-column__status cancelada">
                        <span className="fajilla__table-column__status__label cancelada">Cancelado</span>
                    </div>
                )
            case "Pendiente":
                return (
                    <div className="fajilla__table-column__status pendiente">
                        <span className="fajilla__table-column__status__label pendiente">Pendiente</span>
                    </div>
                )
            default:
                return (
                    <div className="fajilla__table-column__status creada">
                        <span className="fajilla__table-column__status__label creada">Creada</span>
                    </div>
                )
        }
    }

    return setEstadoFajilla()
}

export default FajillaTableColumnStatus
