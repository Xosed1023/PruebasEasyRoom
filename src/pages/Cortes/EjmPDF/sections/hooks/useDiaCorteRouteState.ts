import { useState } from "react"
// stateCorteDia -> value es fecha
// nuevoCorteTurno -> value es un id
// corteTurnoHistorial -> value es un id
interface DiaCorteState {
    typeofValue: "date" | "id"
    value: string
    withLogoutState?: boolean
}

const useDiaCorteRouteState = () => {
    const [diaCorteState] = useState<DiaCorteState>(
        JSON.parse(localStorage.getItem("stateCorteDia") || "{}") as DiaCorteState
    )
    return { diaCorteState }
}

export default useDiaCorteRouteState
