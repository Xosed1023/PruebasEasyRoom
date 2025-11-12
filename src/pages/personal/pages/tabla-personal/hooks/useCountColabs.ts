import { Area, useColaboradoresCountPorAreaLazyQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useCountColabs = ({ areas }: { areas?: Area[] }) => {
    const [getCountsByArea] = useColaboradoresCountPorAreaLazyQuery()
    const { hotel_id } = useProfile()
    const getCounts = async () => {
        if (!areas || !areas.length) {
            return {
                hospedaje: 0,
                alimentosBebidas: 0,
                recepcion: 0,
            }
        }
        const [hospedajeCounts, alimentosBebidasCount, recepcionCount] = await Promise.all([
            getCountsByArea({
                variables: {
                    hotel_id,
                    areas_filter: [areas.find(a => a.nombre === "Hospedaje")?.area_id || ""],
                },
            }),
            getCountsByArea({
                variables: {
                    hotel_id,
                    areas_filter: [areas.find(a => a.nombre === "Alimentos y Bebidas")?.area_id || ""],
                },
            }),
            getCountsByArea({
                variables: {
                    hotel_id,
                    areas_filter: [areas.find(a => a.nombre === "Recepción")?.area_id || ""],
                },
            }),
        ])
        return {
            hospedaje: hospedajeCounts.data?.colaboradores_by_area.paginacion?.total_registros,
            alimentosBebidas: alimentosBebidasCount.data?.colaboradores_by_area.paginacion?.total_registros,
            recepcion: recepcionCount.data?.colaboradores_by_area.paginacion?.total_registros,
        }
    }

    return { getCounts }
}

export default useCountColabs
