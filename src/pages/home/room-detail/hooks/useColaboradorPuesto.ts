import { useQuery } from "@apollo/client"
import { ROOM_COLABORADORES } from "../../graphql/queries/colaborador"
import { useEffect, useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"

export const useColaboradoresPuesto = (puesto: string): any[] => {
    const [colaboradores, setcolaboradores] = useState([])
    const { hotel_id } = useProfile()
    const { data } = useQuery(ROOM_COLABORADORES, {
        variables: {
            datos_busqueda: {
                hotel_id,
                nombre_puesto: puesto,
            },
        },
        fetchPolicy: "no-cache",
    })

    useEffect(() => {
        setcolaboradores(data?.colaboradores_disponibles_por_puesto || [])
    }, [data])

    return colaboradores
}
