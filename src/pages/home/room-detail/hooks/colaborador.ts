import { useEffect, useState } from "react"
import { client } from "src/graphql"
import { ROOM_COLABORADORES } from "../../graphql/queries/colaborador"
import { useProfile } from "src/shared/hooks/useProfile"
import { Puestos } from "src/constants/puestos"
import { useDate } from "src/shared/hooks/useDate"
import * as timeago from "timeago.js"

type Puesto = Puestos.RECAMARISTA | Puestos.MANTENIMIENTO | Puestos.SUPERVISOR | (string & {})

export interface Colab {
    nombre: string
    colaborador_id: string
    ultima_habitacion: string
    tiempo_disponible: string
    puesto_id: string | null
    puesto: string | null
    foto: string
    apellido_paterno: string
    apellido_materno: string
}

export function useColaborador(puesto: Puesto | Puesto[], puestoFiltrado?: Puesto) {
    const { hotel_id } = useProfile()
    const [data, setData] = useState<Colab[]>([])
    const [load, setLoad] = useState<boolean>(true)
    const { UTCStringToLocalDate } = useDate()

    useEffect(() => {
        async function getData() {
            setLoad(true)
            try {
                const { data: colaboradores } = await client.query({
                    query: ROOM_COLABORADORES,
                    variables: {
                        datos_busqueda: {
                            hotel_id,
                            ...(Array.isArray(puesto)
                                ? { nombres_puestos: { in: puesto } }
                                : { nombre_puesto: puesto }),
                        },
                    },
                    fetchPolicy: "no-cache",
                })

                const list = colaboradores?.colaboradores_disponibles_por_puesto

                const colaboradorList = Array.isArray(list) ? list : []
                const combineList = colaboradorList.map(
                    (
                        {
                            nombre = "",
                            apellido_paterno = "",
                            apellido_materno = "",
                            colaborador_id = "",
                            foto = "",
                            colaborador_in_hotel,
                            ultima_tarea = {},
                        },
                        index
                    ) => {
                        const puestos = puestoFiltrado ?? (Array.isArray(puesto) ? null : puesto)

                        const puestoEncontrado = colaborador_in_hotel?.find(
                            (ch) => ch?.puesto?.nombre === puestos
                        )?.puesto

                        const habitacion = `${ultima_tarea?.habitacion?.tipo_habitacion?.nombre} ${ultima_tarea?.habitacion?.numero_habitacion}`
                        //TODO: refactorizar timeago por el hook de formatTimeAgo
                        const fecha_termino = ultima_tarea?.fecha_termino
                            ? timeago.format(UTCStringToLocalDate(ultima_tarea?.fecha_termino), "my-locale").split("Hace ")[1]
                            : "-"

                        return {
                            nombre: `${nombre} ${apellido_paterno} ${apellido_materno}`,
                            colaborador_id,
                            apellido_paterno,
                            apellido_materno,
                            ultima_habitacion: ultima_tarea?.habitacion ? habitacion : "Ninguna",
                            tiempo_disponible: fecha_termino,
                            puesto_id: puestoFiltrado
                                ? puestoEncontrado?.puesto_id || null
                                : colaborador_in_hotel?.[0]?.puesto?.puesto_id || null,
                            puesto: puestoFiltrado
                                ? puestoEncontrado?.nombre || null
                                : colaborador_in_hotel?.[0]?.puesto?.nombre || null,
                            foto,
                        }
                    }
                )
                setData(combineList)
            } catch (e) {
                console.log(e)
            } finally {
                setTimeout(() => setLoad(false), 500)
            }
        }

        getData()
    }, [])

    return {
        data,
        load,
    }
}
