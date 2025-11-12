import { TipoOrden, useGetComandasHistorialCountQuery, useGetOrdenesHistorialCountQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { getDateFilters } from "../helpers/filters"

// TODO: contadores por tab (rs, mostrador, restaurante)
const useCountHistorial = ({ dateFilter }: { dateFilter: Date }) => {
    const { hotel_id } = useProfile()
    const { data: countComandas } = useGetComandasHistorialCountQuery({
        variables: {
            hotel_id,
            fecha_registro: getDateFilters(dateFilter),
        },
    })
    const { data: countOrdenesRoomService } = useGetOrdenesHistorialCountQuery({
        variables: {
            hotel_id,
            fecha_registro: getDateFilters(dateFilter),
            tipo_orden: TipoOrden.RoomService,
        },
    })

    const { data: countOrdenesMostrador } = useGetOrdenesHistorialCountQuery({
        variables: {
            hotel_id,
            fecha_registro: getDateFilters(dateFilter),
            tipo_orden: TipoOrden.Mostrador,
        },
    })

    return { countComandas: countComandas?.historial_estados_comanda.paginacion.total_registros, countOrdenesRoomService: countOrdenesRoomService?.historial_estados_orden.paginacion.total_registros, countOrdenesMostrador: countOrdenesMostrador?.historial_estados_orden.paginacion.total_registros }
}

export default useCountHistorial
