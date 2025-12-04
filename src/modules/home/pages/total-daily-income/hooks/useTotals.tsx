import { useEffect, useState } from "react"
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
    { title: "Estancia", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
    { title: "Room service", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
    { title: "Restaurante", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
    { title: "Propinas", total: 0, matutino: 0, vespertino: 0, nocturno: 0 },
]

export function useTotals({ hotel_id, date }: { date?: Date; hotel_id: string }) {
    const [loading, setLoading] = useState(true)
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
    })

    const [getVentas] = useObtener_VentasLazyQuery()

    useEffect(() => {
        if (!hotel_id || !date || !ultimoCorte || !turnos) {
            return
        }
        getStats()
    }, [ultimoCorte, turnos, hotel_id])

    const getStats = async () => {
        setLoading(true)
        let total = 0
        let values = [...stats.data]

        getVentas({
            variables: {
                get_today_sales_input: {
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
             .finally(() => {
                setLoading(false) 
            })
    }

    return {
        stats, loading
    }
}
