import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useDateTurno } from "./useDateTurno"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDate } from "src/shared/hooks/useDate"
import { useCurrentDateQuery } from "src/gql/schema"
import FormatUTCDateToApiDate from "../../EjmPDF/sections/helpers/FormatUTCDateToApiDate"

export const getDateFormat = (date: Date | string, isUTC: boolean, formatZ?: boolean): string => {
    const current = new Date(date)
    current.setHours(current.getHours() + (isUTC ? 6 : 0))

    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, "0")
    const day = String(current.getDate()).padStart(2, "0")
    const hours = String(current.getHours()).padStart(2, "0")
    const minutes = String(current.getMinutes()).padStart(2, "0")
    const seconds = String(current.getSeconds()).padStart(2, "0")
    const miliseconds = String(current.getMilliseconds()).padStart(3, "0")

    return formatZ
        ? `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${miliseconds}Z`
        : `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${miliseconds}`
}

function getObjectParams(params: any) {
    return {
        startDate: params?.fecha_inicio || "",
        endDate: params?.fecha_fin || "",
        turno_id: params?.turno_id || "",
        hora_entrada: "",
        hora_salida: "",
        nombre: params?.turno || "",
        usuario_id: params?.usuario_id || "",
        corte_pendiente: params?.corte_pendiente || false,
    }
}

export function useMovimientosParams() {
    const params = useLocation()
    const { data } = useCurrentDateQuery()

    const { usuario_id } = useProfile()
    const { startDate, endDate, turno_id, hora_entrada, hora_salida, nombre, ultimo_corte, loading } = useDateTurno()
    const { localDateToUTCString, UTCStringToLocalDate } = useDate()

    return useMemo(() => {
        const objectParams = getObjectParams(params.state)

        const responseWithoutParams = {
            fecha_inicio: startDate ? FormatUTCDateToApiDate(startDate, true) : "",
            fecha_fin: startDate ? getDateFormat(endDate, true) : "",
            usuario_id,
            date: data?.serverDate || localDateToUTCString(new Date()),
            params: {},
            turno_id,
            hora_entrada,
            hora_salida,
            nombre,
            ultimo_corte,
            loading,
            corte_pendiente: true,
        }

        const responseWithParams = {
            ...objectParams,
            fecha_inicio: objectParams.startDate
                ? FormatUTCDateToApiDate(objectParams.startDate, true)
                : responseWithoutParams.fecha_inicio,
            fecha_fin: objectParams.endDate
                ? FormatUTCDateToApiDate(objectParams.endDate, true)
                : responseWithoutParams.fecha_fin,
            date: UTCStringToLocalDate(`${objectParams.startDate}`.replace(" ", "T")),
            ultimo_corte: "",
            params: params.state,
            loading: false,
        }
        return params.state && Object.values(params.state).length > 0 ? responseWithParams : responseWithoutParams
    }, [
        startDate,
        params.state?.fecha_inicio,
        turno_id,
        hora_entrada,
        hora_salida,
        nombre,
        ultimo_corte,
        loading,
        data,
    ])
}
