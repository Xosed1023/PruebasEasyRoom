import { useState } from "react"
import { Colaborador, Colaboradores, Incidencias } from "./index.types"
import { client } from "src/graphql"
import { GET_COLABORADORES, GET_INCIDENCIAS } from "src/graphql/queries/dashboard"
import { useProfile } from "src/shared/hooks/useProfile"
import { useComponentLoad } from "./effect"
import { getLimitDate } from "../helpers/date"

export function useDrawerData() {
    const { hotel_id } = useProfile()
    const [incidencias, setIncidencias] = useState<Incidencias>({
        totalAbiertas: 0,
        abiertas: 0,
        cerradas: 0,
        matutino: 0,
        vespertino: 0,
        nocturno: 0,
        altas: 0,
        medias: 0,
        bajas: 0,
    })
    const [colaboradores, setColaboradores] = useState<Colaboradores>({
        camaritas: [],
        mantenimiento: [],
        meseros: [],
        otros: [],
    })

    const getValue = (key: string, value: string, count: number) => (key === value ? count + 1 : count)

    const fetchIncidencias = () => {
        client
            .query({
                query: GET_INCIDENCIAS,
                variables: {
                    fecha_registro: null,
                    hotel_id,
                    turno_id: null,
                },
            })
            .then(({ data }) => {
                const list: any[] = data?.incidencias || []
                if (list.length > 0) {
                    const obj = {
                        totalAbiertas: 0,
                        abiertas: 0,
                        cerradas: 0,
                        matutino: 0,
                        vespertino: 0,
                        nocturno: 0,
                        altas: 0,
                        medias: 0,
                        bajas: 0,
                    }
                    list.forEach(({ estado = "", turno, severidad = "", fecha_registro = "" }) => {
                        const { max, min, current } = getLimitDate(fecha_registro)
                        if (current >= min && current <= max) {
                            obj.abiertas = getValue(estado, "activa", obj.abiertas)
                            obj.cerradas = getValue(estado, "cerrada", obj.cerradas)
                            obj.matutino = getValue(turno?.nombre, "Matutino", obj.matutino)
                            obj.vespertino = getValue(turno?.nombre, "Vespertino", obj.vespertino)
                            obj.nocturno = getValue(turno?.nombre, "Nocturno", obj.nocturno)
                        }

                        if (estado === "activa") {
                            obj.totalAbiertas = getValue(estado, "activa", obj.totalAbiertas)
                            obj.altas = getValue(severidad, "alta", obj.altas)
                            obj.medias = getValue(severidad, "media", obj.medias)
                            obj.bajas = getValue(severidad, "baja", obj.bajas)
                        }
                    })
                    setIncidencias(obj)
                }
            })
            .catch(console.log)
    }

    const fetchColaboradores = async () => {
        try {
            const { data } = await client.query({
                query: GET_COLABORADORES,
                variables: {
                    hotel_id,
                },
            })
            const list: any[] = Array.isArray(data?.colaboradores) ? data?.colaboradores : []

            if (list.length > 0) {
                const clear = list.map((colaborador) => {
                    const item = colaborador?.ultima_tarea
                    const isMesero = colaborador?.puesto?.nombre === "Mesero"

                    const roomName = item?.habitacion?.tipo_habitacion?.nombre
                        ? `${item?.habitacion?.tipo_habitacion?.nombre || "Habitación"}
                        ${item?.habitacion?.numero_habitacion}`
                        : "Ninguna"
                    const mesa = colaborador?.ultima_orden?.mesa?.numero_mesa || ""

                    const disponible = isMesero
                        ? !colaborador?.mesa_asignada_activa?.has_mesa_activa
                        : item
                        ? !!item?.fecha_termino
                        : true

                    return {
                        name: `${colaborador?.nombre} ${colaborador?.apellido_paterno}`,
                        image: colaborador?.foto || require("src/assets/webp/profile_default.webp"),
                        description: `${
                            item
                                ? item?.fecha_termino
                                    ? `Últ. 
                                        ${
                                            colaborador?.puesto?.nombre === "Mantenimiento"
                                                ? "mantenimiento"
                                                : "limpieza"
                                        }: ${roomName}`
                                    : roomName
                                : "Disponible"
                        }`,
                        descripcion_mesero: `${disponible ? "Disponible" : `Mesa ${mesa}`}`,
                        puesto: colaborador?.puesto?.nombre,
                        disponible,
                        room: roomName,
                        mesa: mesa ? `Mesa ${mesa}` : "Ninguna",
                        fecha_habitacion_anterior: item?.fecha_termino || "",
                        fecha_habitacion_actual: item?.fecha_incio || "",
                        fecha_mesa_anterior:
                            colaborador?.ultima_orden?.mesa?.ultima_asignacion?.fecha_cuenta_cerrada || "",
                        fecha_mesa_actual: colaborador?.ultima_orden?.mesa?.asignacion_actual?.fecha_registro || "",
                    }
                })

                const camaritas: Colaborador[] = []
                const mantenimiento: Colaborador[] = []
                const meseros: Colaborador[] = []
                const otros: Colaborador[] = []

                clear?.forEach((item) => {
                    if (item?.puesto === "Camarista") {
                        camaritas.push(item)
                    } else if (item?.puesto === "Mantenimiento") {
                        mantenimiento.push(item)
                    } else if (item?.puesto === "Mesero") {
                        meseros.push(item)
                    } else {
                        otros.push(item)
                    }
                })

                setColaboradores({
                    camaritas,
                    mantenimiento,
                    otros,
                    meseros,
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    useComponentLoad(() => {
        fetchIncidencias()
        fetchColaboradores()
    })

    return {
        incidencias,
        colaboradores,
    }
}
