import { client } from "src/graphql"
import { CREAR_COLABORADOR_TAREA } from "../../graphql/mutations/colaborador"
import { Estados_Habitaciones } from "src/gql/schema"

type Params = {
    datos_tarea: {
        descripcion: string
        nombre: string
        puesto_id: string
        tipo?: string
    }
    datos_colaborador_tarea: {
        colaborador_ids: string[]
        descripcion_tarea: string
        habitacion_id: string
        tipo_limpieza?: string
    }
    usuario_id: string
    estadoHabitacion?: Estados_Habitaciones
}

export async function assignColaborador({
    datos_tarea,
    datos_colaborador_tarea,
    estadoHabitacion,
    usuario_id,
}: Params) {
    try {
        let res = null
        const { data: response } = await client.mutate({
            mutation: CREAR_COLABORADOR_TAREA,
            variables: {
                datos_colaborador_tarea: {
                    fecha_inicio: new Date().toISOString(),
                    colaborador_id: datos_colaborador_tarea.colaborador_ids,
                    descripcion_tarea: datos_colaborador_tarea.descripcion_tarea,
                    habitacion_id: datos_colaborador_tarea.habitacion_id,
                    ...(datos_colaborador_tarea.tipo_limpieza
                        ? { tipo_limpieza: datos_colaborador_tarea.tipo_limpieza }
                        : {}),
                    tarea: {
                        nombre: datos_tarea.nombre,
                        descripcion: datos_tarea.descripcion,
                        puesto_id: datos_tarea.puesto_id,
                        tipo: datos_tarea.tipo,
                    },
                    usuario_id,
                    ...(estadoHabitacion ? { estado: estadoHabitacion } : {}),
                },
            },
            fetchPolicy: "no-cache",
        })
        res = response

        return res
    } catch (e) {
        console.log(e)
        return null
    }
}
