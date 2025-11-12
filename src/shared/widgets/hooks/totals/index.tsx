import { useEffect, useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"
import { getDateParams } from "../rentas/date"
import { useGetTurnosQuery, useUltimo_CorteQuery } from "src/gql/schema"
import { useObtener_VentasLazyQuery } from "src/gql/schema"

type State = {
    total: number
    data: {
        title: string
        total: number
        matutino: number
        vespertino: number
        nocturno: number
    }[]
}

const data = [
    { title: "Acumulado de estancia", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
    { title: "Acumulado de room service", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
    { title: "Acumulado de restaurante", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
    { title: "Acumulado de propinas", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
]

export function useTotals() {
    const { hotel_id } = useProfile()
    const [stats, setStats] = useState<State>({
        total: 0,
        data: [...data],
    })

    const { data: ultimoCorte } = useUltimo_CorteQuery({
        variables: {
            hotel_id,
        },
    })

    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id,
        },
        skip: !ultimoCorte?.ultimo_corte,
    })

    const [getVentas] = useObtener_VentasLazyQuery()

    const getStats = async () => {
        let total = 0
        let values = [...stats.data]

        const hora_inicio = turnos?.turnos?.find((t) => t?.nombre === "Matutino")?.hora_entrada?.split(":")
        const date = new Date()

        const fecha_inicio_matutino = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            Number(hora_inicio?.[0] || date.getHours()),
            Number(hora_inicio?.[1] || date.getMinutes()),
            0,
            0
        ).toISOString()

        const fecha_inicial =
            ultimoCorte?.ultimo_corte?.fecha_fin_corte || fecha_inicio_matutino || new Date().toISOString()
        const { fecha_final } = getDateParams()

        getVentas({
            variables: {
                get_today_sales_input: {
                    fecha_inicial,
                    fecha_final,
                    hotel_id,
                },
            },
        })
            .then(({ data }) => {
                data?.obtener_ventas?.forEach((item) => {
                    const total_renta =
                        Number(item?.total_extras || 0) +
                        Number(item?.total_rentas || 0) +
                        Number(item?.total_reservas || 0)
                    const total_rs = Number(item?.total_ordenes || 0)
                    const total_propinas = Number(item?.total_propinas || 0)
                    const total_restaurante = Number(item?.total_restaurante || 0)

                    total += total_renta + total_rs + total_propinas + total_restaurante

                    const docs = [total_renta, total_rs, total_restaurante, total_propinas]

                    if (item?.nombre === "Matutino") {
                        values = values.map((item, i) => {
                            return { ...item, matutino: docs?.[i] || 0 }
                        })
                    }
                    if (item?.nombre === "Vespertino") {
                        values = values.map((item, i) => {
                            return { ...item, vespertino: docs?.[i] || 0 }
                        })
                    }
                    if (item?.nombre === "Nocturno") {
                        values = values.map((item, i) => {
                            return { ...item, nocturno: docs?.[i] || 0 }
                        })
                    }
                })

                setStats({
                    total,
                    data: values.map((item) => {
                        return { ...item, total: item.matutino + item.vespertino + item.nocturno }
                    }),
                })
            })
            .catch((e) => {
                setStats({
                    total: 0,
                    data: [...data],
                })
                console.log(e)
            })
    }

    useEffect(() => {
        if(turnos && ultimoCorte) {
            getStats()
        }
    }, [ultimoCorte, turnos])
    
    return {
        ...stats,
    }
}
