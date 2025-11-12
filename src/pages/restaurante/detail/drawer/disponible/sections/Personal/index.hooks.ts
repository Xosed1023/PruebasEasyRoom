import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useGetAreaRestauranteLazyQuery, useGetRestaurantAreaColaboradoresLazyQuery } from "src/gql/schema"
import { getName } from "src/pages/propinas/home/helpers/name"
import { useProfile } from "src/shared/hooks/useProfile"
import { RootState } from "src/store/store"

type Colaborador = {
    nombre: string
    colaborador_id: string
    mesa: string
    foto: string
}

const AREA = "Alimentos y Bebidas"

export function useGetRestaurantColaboradores() {
    const [load, setLoad] = useState<boolean>(true)
    const [data, setData] = useState<Colaborador[]>([])

    const { hotel_id } = useProfile()
    const mesas = useSelector((root: RootState) => root.restaurant.mesas)

    const [areas] = useGetAreaRestauranteLazyQuery()
    const [colaboradores] = useGetRestaurantAreaColaboradoresLazyQuery()

    const getMesa = (colaborador_id: string): string => {
        let mesa = ""
        for (const m of mesas) {
            if (m?.ultima_asignacion?.colaborador_asignado_id === colaborador_id) {
                mesa = `Mesa ${m?.numero_mesa}`
                break
            }
        }
        return mesa
    }

    useEffect(() => {
        areas({ variables: { hotel_id, nombre: AREA } })
            .then(({ data }) => {
                const area_id = data?.areas?.[0]?.area_id || ""
                if (area_id) {
                    colaboradores({ variables: { hotel_id, area_id } })
                        .then(({ data }) => {
                            if (data?.colaboradores) {
                                setData(
                                    data?.colaboradores?.map((c) => {
                                        return {
                                            nombre: getName(c),
                                            colaborador_id: c.colaborador_id,
                                            mesa: getMesa(c.colaborador_id),
                                            foto: c?.foto || "",
                                        }
                                    })
                                )
                            }
                        })
                        .catch((e) => console.log(e))
                        .finally(() => setLoad(false))
                } else {
                    setLoad(false)
                }
            })
            .catch((e) => {
                console.log(e)
                setLoad(false)
            })
    }, [])

    return {
        data,
        load,
    }
}
