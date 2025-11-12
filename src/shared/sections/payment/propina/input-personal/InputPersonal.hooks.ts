import { useGetColaboradoresForValidationQuery, useGetColaboradoresQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const AREAS = ["Hospedaje", "Alimentos y Bebidas"]
const PUESTOS = ["Recepcionista", "Valet parking", "Gerente"]
const PUESTOSESTANCIA = ["Recepcionista", "Valet parking"]

type usePersonalListOptions = {
    type?: "roomservice" | "estancia"
}

type usePersonalRSParams = {
    skip?: boolean
}

const getFilter = (array: any[]) => {
    return (
        array?.filter((colaborador) => {
            const area = colaborador?.puesto?.area?.nombre || ""
            const puesto = colaborador?.puesto?.nombre || ""
            const en_turno = colaborador?.en_turno

            return AREAS.includes(area) ? en_turno : PUESTOS.includes(puesto)
        }) || []
    )
}

export function usePersonalList(options?: usePersonalListOptions) {
    const { hotel_id } = useProfile()

    const { data } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })
    const colaboradores = getFilter(data?.colaboradores || [])

    const filteredType =
        options?.type === "roomservice"
            ? colaboradores.filter((c) => c?.puesto?.area?.nombre === "Alimentos y Bebidas")
            : options?.type === "estancia"
            ? colaboradores.filter(
                (c) =>
                    c?.en_turno &&
                    (c?.puesto?.area?.nombre === "Alimentos y Bebidas" ||
                        PUESTOSESTANCIA.includes(c?.puesto?.nombre || "")))
            : colaboradores

    return {
        data: filteredType.length ? filteredType : colaboradores,
        dataConsumoInterno: data?.colaboradores || [],
    }
}

export function usePersonalRoomService(options?: usePersonalRSParams) {
    const { hotel_id } = useProfile()

    const { data: colaboradores, loading } = useGetColaboradoresForValidationQuery({
        variables: {
            hotel_id,
        },
        skip: options?.skip,
    })

    return {
        colaboradores:
            getFilter(colaboradores?.colaboradores || []).filter((c) => {
                const area = c?.puesto?.area?.nombre || ""
                return area === "Alimentos y Bebidas"
            }) || [],
        loading,
    }
}
