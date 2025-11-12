import { gql } from "@apollo/client"

export const GET_MY_PROFILE = gql`
    query GetMyProfile($sesion_id: ID) {
        mi_perfil {
            usuario_id
            nombre
            apellido_paterno
            apellido_materno
            correo
            fecha_registro
            fecha_modificacion
            eliminado
            telefono
            estatus
            hotel(sesion_id: $sesion_id) {
                nombre_hotel
                hotel_id
                zona_horaria
                logo_hotel
                configurations {
                    cardHabitacion {
                        tamano
                        tamano_fijo
                    }
                    panel {
                        imagen_promo
                        banner
                    }
                }
            }
            roles {
                rol_id
                grupo_hotel_id
                nombre
                eliminado
                grupo_hotel {
                    grupo_hotel_id
                }
            }
            metodos_de_pago {
                metododepago_id
                payment_token
                estatus
                eliminado
                default
            }
            turno {
                nombre
                turno_id
            }
            colaborador {
                colaborador_id
                nombre
                en_turno
                estado
            }
        }
    }
`
