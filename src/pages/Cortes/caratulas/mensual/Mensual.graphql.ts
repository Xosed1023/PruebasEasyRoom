import { gql } from "@apollo/client"

export const GET_CORTES_ANIO = gql`
    query Cortes_por_anio($hotel_id: ID!, $fecha_inicio_corte: DateSearchInput) {
        cortes_por_anio(hotel_id: $hotel_id, fecha_inicio_corte: $fecha_inicio_corte) {
            cortes_cerrados
            gastos
            incidencias
            ingresos
            mes
            utilidad
        }
    }
`
