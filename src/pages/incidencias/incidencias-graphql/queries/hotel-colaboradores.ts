import { gql } from "@apollo/client"

export const GET_COLABORADORES = gql`
    query Hotel_colaboradores($hotel_id: ID) {
        hotel_colaboradores(hotel_id: $hotel_id, eliminado: false) {
            colaborador_id
            colaborador {
                nombre
                apellido_paterno
                apellido_materno
                turno_id
                foto
                en_turno
            }
            puesto {
                nombre
                areas {
                    nombre
                }
            }
        }
    }
`
