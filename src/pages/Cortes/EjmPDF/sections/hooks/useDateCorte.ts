import useDiaCorteRouteState from "../hooks/useDiaCorteRouteState"
import FormatUTCDateToApiDate from "./../helpers/FormatUTCDateToApiDate"

function useDateCorte() {
    const { diaCorteState } = useDiaCorteRouteState()
    const payload = diaCorteState.typeofValue === "date" ? diaCorteState.value : ""
    const date = payload?.split("&")

    const fecha_corte_inicio = date?.[0] ? FormatUTCDateToApiDate(date?.[0], true) : ""
    const fecha_corte_fin = date?.[1] ? FormatUTCDateToApiDate(date?.[1], true) : ""

    return {
        fecha_corte_inicio,
        fecha_corte_fin,
        fechas_corte: localStorage.getItem("@fechas-corte") || "",
    }
}

export default useDateCorte
