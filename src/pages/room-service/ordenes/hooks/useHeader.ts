import { useMemo } from "react"
import { allOrdersHeaders } from "../Ordenes.constants"
import { useGetTurnosQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
//import { capitalize } from "src/shared/helpers/capitalize"

export function useHeader(data: any[], type: string, withRestaurante: boolean) {
    const { hotel_id } = useProfile()
    
    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id
        }
    })

    const turnosList = turnos?.turnos ? turnos?.turnos?.map((i)=>{
        return { value: i?.turno_id, valueToDisplay: i?.nombre }
    }) : []

    /*
    const getOrigenOptions = () => {
        const uniqueOrigins: Set<string> = new Set()

        data?.forEach((item) => {
            const origen = item?.origen_orden
            if (origen) {
                uniqueOrigins.add(origen)
            }
        })
        const options = Array.from(uniqueOrigins).map((origen) => ({
            value: origen,
            valueToDisplay: capitalize(origen?.split("_")?.join(" ")) || "",
        }))

        return options.length > 1 ? [{ value: "todos_origenes", valueToDisplay: "Todos" }, ...options] : options
    }
    */
    const headers = useMemo(() => {
        return allOrdersHeaders.map((value, index) => {
            return index === 2 ? { ...value, filterMenu: type === "todas" ? [...(value.filterMenu || []), ...(withRestaurante ? [{ value: "restaurante", valueToDisplay: "Restaurante" }] : [])] : undefined } : index === 3 ? {...value, filterMenu: [ { value: "todos_turnos", valueToDisplay: "Todos" }, ...turnosList ]}  : value
        })
    }, [data, type, withRestaurante])

    return {
        headers,
    }
}
