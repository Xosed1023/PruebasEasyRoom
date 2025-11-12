import { gql } from "@apollo/client"
import { useEffect, useState } from "react"
import { PageOptionsArgs, useColaboradoresPorHotelTableLazyQuery } from "src/gql/schema"
import { client } from "src/graphql"
import { useProfile } from "src/shared/hooks/useProfile"

const QUERY = gql`
    query ColaboradoresPorHotel($hotel_id: ID!, $date_asignaciones: DateSearchInput!) {
        colaboradores(hotel_id: $hotel_id, eliminado: false) {
            apellido_materno
            apellido_paterno
            nombre
            numero_id
            usuario_id
            colaborador_id
            estado
            en_turno
            foto
            es_supervisor(hotel_id: $hotel_id)
            ultima_tarea {
                tarea_id
                fecha_inicio
                fecha_termino
                colaborador_tarea_id
                habitacion_id
                habitacion {
                    numero_habitacion
                    estado
                    tipo_habitacion_id
                    tipo_habitacion {
                        nombre
                    }
                }
            }
            mesa_asignada_activa {
                has_mesa_activa
            }
            colaborador_in_hotel {
                puesto_id
                puesto {
                    descripcion
                    nombre
                    descripcion
                    puesto_id
                }
            }
            turno_id
            turno {
                nombre
                estado
            }
            asistencia_abierta {
                asistencia_id
                fecha_entrada
                fecha_salida
            }
            ultima_orden {
                orden_id
                orden
                fecha_registro
            }
            cantidad_ordenes
            numero_asignaciones(DateSearchInput: $date_asignaciones)
        }
    }
`

const getDate = () => {
    const d = new Date()
    return {
        fecha_inicial: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString(),
        fecha_final: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 59).toISOString(),
    }
}

export function useColaboradoresPorHotel({
    areas_filter,
    pagination_options,
    searchValue,
    puestoFilter
}: {
    searchValue?: string
    areas_filter?: string[]
    pagination_options?: PageOptionsArgs
    puestoFilter?: string
}) {
    const { hotel_id } = useProfile()
    const [isLoading, setisLoading] = useState(false)
    const [getColabs, colabs] = useColaboradoresPorHotelTableLazyQuery()

    useEffect(() => {
        refetchColabs()
    }, [areas_filter, pagination_options, puestoFilter, searchValue])

    const refetchColabs = () => {
        if (areas_filter && pagination_options && areas_filter[0]) {
            setisLoading(true)
            getColabs({
                variables: {
                    hotel_id,
                    date_asignaciones: getDate(),
                    areas_filter,
                    pagination_options,
                    ...(puestoFilter?.length ? {puesto_id: puestoFilter} : {}),
                    ...(searchValue ? {nombre: searchValue} : {})
                },
            }).finally(() => {
                setisLoading(false)
            })
        }
    }

    return { colabs, isLoading, getColabs, refetchColabs }
}

export function useColaboradoresPorHotelLazy() {
    const { hotel_id } = useProfile()
    const getColaboradores = () =>
        client.query({
            query: QUERY,
            variables: {
                hotel_id,
                date_asignaciones: getDate(),
                eliminado: false,
            },
        })

    return {
        getColaboradores,
    }
}
