import { useEffect, useState } from "react"
import { GetCorteQuery, useGetCorteLazyQuery } from "src/gql/schema"
import FormatUTCDateToApiDate from "../helpers/FormatUTCDateToApiDate"

const useGetCorteById = ({
    corte_id,
}: {
    corte_id?: string
}): {
    fechasCorte?: { inicio: string; fin: string }
    corte?: GetCorteQuery
} => {
    const [corte, setcorte] = useState<GetCorteQuery>()
    const [fechasCorte, setfechasCorte] = useState<{ inicio: string; fin: string }>()
    const [getCorte] = useGetCorteLazyQuery()

    useEffect(() => {
        if (corte_id) {
            getCorte({
                variables: {
                    corte_id,
                },
            }).then((c) => {
                setcorte(c.data)
                const fecha_inicio_corte = FormatUTCDateToApiDate(c.data?.corte?.fecha_inicio_corte || "", true)
                
                const fecha_fin_corte = FormatUTCDateToApiDate(c.data?.corte?.fecha_fin_corte || "", true)
                
                setfechasCorte({
                    inicio: fecha_inicio_corte,
                    fin: fecha_fin_corte,
                })
            })
        }
    }, [corte_id])

    return { corte, fechasCorte }
}

export default useGetCorteById
