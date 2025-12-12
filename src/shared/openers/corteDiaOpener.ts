export const corteDiaOpener = ({
    stateCorteDia,
    stateCorteHistorial,
    stateNuevoCorteTurno,
}: {
    stateNuevoCorteTurno?: {
        corte_id: string
        withLogoutState?: boolean
    }
    stateCorteHistorial?: {
        corte_id: string
    }
    stateCorteDia?: {
        fecha: string
    }
}) => {
    if (stateCorteDia) {
        localStorage.setItem("stateCorteDia", JSON.stringify({ typeofValue: "date", value: stateCorteDia.fecha }))
        // dia-corte -> Cuando se selecciona el corte del día
        window.open(`/pdf/dia-corte`, "_blank")
    }
    if (stateNuevoCorteTurno) {
        localStorage.setItem(
            "stateCorteDia",
            JSON.stringify({
                typeofValue: "id",
                value: stateNuevoCorteTurno.corte_id,
                withLogoutState: stateNuevoCorteTurno.withLogoutState,
            })
        )
        // resumen-corte/:corte_id -> cuando se crea un nuevo corte
        window.open(`/pdf/resumen-corte`, "_blank")
    }
    if (stateCorteHistorial) {
        localStorage.setItem(
            "stateCorteDia",
            JSON.stringify({ typeofValue: "id", value: stateCorteHistorial.corte_id })
        )
        // turno-corte -> cuando se selecciona un corte de turno en específico
        window.open(`/pdf/turno-corte`, "_blank")
    }
}

export default corteDiaOpener
