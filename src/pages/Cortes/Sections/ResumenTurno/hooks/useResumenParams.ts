import { useLazyQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { GetCorteQuery, useGetCorteLazyQuery } from "src/gql/schema"
import FormatUTCDateToApiDate from "src/pages/Cortes/EjmPDF/sections/helpers/FormatUTCDateToApiDate"
import { GET_ULTIMO_CORTE, useDateTurno } from "src/pages/Cortes/home/hooks/useDateTurno"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"

export const getDateFormat = (date: Date | string, isUTC: boolean): string => {
    const current = new Date(date)
    current.setHours(current.getHours() + (isUTC ? 6 : 0))

    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, "0")
    const day = String(current.getDate()).padStart(2, "0")
    const hours = String(current.getHours()).padStart(2, "0")
    const minutes = String(current.getMinutes()).padStart(2, "0")
    const seconds = String(current.getSeconds()).padStart(2, "0")
    const miliseconds = String(current.getSeconds()).padStart(3, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${miliseconds}`
}

export function useResumenParams(corte_id: string) {
    const { usuario_id, hotel_id } = useProfile()
    const { startDate, endDate, ...rest } = useDateTurno()
    const { UTCStringToLocalDate } = useDate()

    const [data, setData] = useState<GetCorteQuery>()
    const [load, setLoad] = useState<boolean>(true)

    const [getCorteSelected] = useGetCorteLazyQuery()

    const [getUltimoCorte] = useLazyQuery(GET_ULTIMO_CORTE)

    useEffect(() => {
        setLoad(true)
        if (corte_id) {
            getCorteSelected({
                variables: {
                    corte_id,
                },
            })
                .then((data) => setData(data.data))
                .finally(() => setLoad(false))
            return
        }
        getUltimoCorte({
            variables: {
                hotel_id,
            },
        })
            .then((data) => setData(data.data))
            .finally(() => setLoad(false))
    }, [corte_id])

    const responseWithoutParams = {
        fecha_inicio: startDate ? FormatUTCDateToApiDate(startDate, true) : "",
        fecha_fin: startDate ? getDateFormat(endDate, true) : "",
        usuario_id,
        date: startDate || new Date().toISOString(),
        fecha_cierre: null,
        ...rest,
        loading: load || rest.loading,
        estatus: "",
    }

    const responseWithParams = {
        fecha_inicio: data ? FormatUTCDateToApiDate(data?.corte?.fecha_inicio_corte, true) : "",
        fecha_fin: data ? FormatUTCDateToApiDate(data?.corte?.fecha_fin_corte || "", true) : "",
        usuario_id,
        turno_id: data?.corte?.turno_id,
        nombre: data?.corte?.turno?.nombre,
        date: UTCStringToLocalDate(data?.corte?.fecha_inicio_corte || ""),
        fecha_cierre: data?.corte?.fecha_cierre_corte,
        loading: load || rest.loading,
        estatus: data?.corte?.estatus || "",
    }
    return data?.corte ? responseWithParams : responseWithoutParams
}
