import { gql, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"

export const GET_PUESTOS = gql`
    query {
        puestos {
            nombre
            puesto_id
        }
    }
`

export const usePuestos = (): { nombre: string; puesto_id: string }[] => {
    const [puestos, setpuestos] = useState([])
    const { data } = useQuery(GET_PUESTOS)

    useEffect(() => {
        setpuestos(data?.puestos || [])
    }, [data])

    return puestos
}
