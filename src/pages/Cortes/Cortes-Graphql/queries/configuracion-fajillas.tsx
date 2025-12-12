import { gql } from "@apollo/client"

export const GET_CONFIG_FAJILLAS = gql`
    query Configuraciones_fajilla($hotelId: ID!) {
        configuraciones_fajilla(hotel_id: $hotelId) {
            valor
            usuario_id
            hotel_id
            fecha_creacion
            eliminado
            configuracion_fajilla_id
        }
    }
`
