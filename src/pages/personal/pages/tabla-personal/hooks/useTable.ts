import { useMemo } from "react"
import { Colaborador, useGetPuestosByHotelIdQuery } from "src/gql/schema"
import { AreasName } from "src/pages/personal/inicio.constants"
import { FilterMenuItem, FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useDate } from "src/shared/hooks/useDate"
import { getDateStringDMYH } from "src/utils/date"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"

const ITEM_ALL = { value: "Todos", valueToDisplay: "Todos" }

export function useHeader(data: any[], path: AreasName) {

    const { data: puestos } = useGetPuestosByHotelIdQuery()
    const { rolName } = useProfile()

    const getFilterOptions = (): FilterMenuItem[] => {
        const puestosFiltrados = puestos?.puestos.filter(p => p.area?.nombre === path) || []

        return [ITEM_ALL, ...puestosFiltrados.map((puesto) => ({ value: puesto.puesto_id, valueToDisplay: puesto.nombre, }))]
    }

    const headers: FlexibleTableHeaderColumn[] = useMemo(() => {
        const filterOptions = getFilterOptions()

        if (path === "Recepción") {
            return [
                { value: "Personal" },
                {
                    value: "Puesto",
                    filterMenu: filterOptions,
                    isFilterUnique: true
                },
                { value: "Último turno" },
                ...(rolName !== RoleNames.monitoreo ? [{ value: "Activo" }] : []),
            ]
        }
        if (path === "Hospedaje") {
            return [
                { value: "Personal" },
                {
                    value: "Puesto",
                    filterMenu: filterOptions,
                    isFilterUnique: true
                },
                { value: "Asignaciones en turno" },
                { value: "Habitación asignada" },
                { value: "Último turno" },
                { value: "Última asignación" },
                ...(rolName !== RoleNames.monitoreo ? [{ value: "Activo" }] : []),
            ]
        } else {
            return [
                { value: "Personal" },
                {
                    value: "Puesto",
                    filterMenu: filterOptions,
                    isFilterUnique: true
                },
                { value: "Órdenes atendidas" },
                { value: "Último turno" },
                { value: "Última orden atendida" },
                ...(rolName !== RoleNames.monitoreo ? [{ value: "Activo" }] : []),
            ]
        }
    }, [data, path, puestos])

    return headers
}

export function useRows(path: AreasName) {
    const { UTCStringToLocalDate } = useDate()
    const { rolName } = useProfile()

    const getRowFormat = (list: Colaborador[]) => {
        return list.map((item) => {
            const baseHospedaje = [
                {
                    value: {
                        name: item?.nombre,
                        foto: item?.foto,
                    },
                },
                {
                    value: {
                        puesto: item?.colaborador_in_hotel?.[0].puesto?.nombre || "",
                        es_supervisor: item?.es_supervisor,
                    },
                },
                { value: item?.numero_asignaciones ?? "0" },
                { value: item?.ultima_tarea?.habitacion?.numero_habitacion || "N/A" },
                {
                    value: {
                        ultimo_turno: item.turno.nombre ? item.turno.nombre : "-",
                        date: item?.ultima_asistencia_cerrada
                            ? `${getDateStringDMYH(UTCStringToLocalDate(item?.ultima_asistencia_cerrada.fecha_entrada))}`
                            : "",
                    },
                },
                {
                    value: {
                        room: item?.ultima_tarea?.habitacion?.numero_habitacion || "Sin asignar",
                        date: item?.ultima_tarea?.fecha_registro
                            ? `${getDateStringDMYH(UTCStringToLocalDate(item?.ultima_tarea?.fecha_registro))}`
                            : "",
                    },
                },
                {
                    value: {
                        en_turno: item?.en_turno || false,
                        colaborador_id: item?.colaborador_id,
                    },
                },
            ]
            const baseRecepcion = [
                {
                    value: {
                        name: item?.nombre,
                        foto: item?.foto,
                    },
                },
                {
                    value: {
                        puesto: item?.colaborador_in_hotel?.[0].puesto?.nombre || "",
                        es_supervisor: item?.es_supervisor,
                    },
                },
                {
                    value: {
                        ultimo_turno: item.turno.nombre ? item.turno.nombre : "-",
                        date: item?.ultima_asistencia_cerrada
                            ? `${getDateStringDMYH(UTCStringToLocalDate(item?.ultima_asistencia_cerrada.fecha_entrada))}`
                            : "",
                    },
                },
                {
                    value: {
                        en_turno: item?.en_turno || false,
                        colaborador_id: item?.colaborador_id,
                    },
                },
            ]
            const baseAliemntos = [
                {
                    value: {
                        name: item?.nombre,
                        foto: item?.foto,
                    },
                },
                {
                    value: {
                        puesto: item?.colaborador_in_hotel?.[0].puesto?.nombre || "",
                        es_supervisor: item?.es_supervisor,
                    },
                },
                { value: item?.cantidad_ordenes ?? "0" },
                {
                    value: {
                        ultimo_turno: item.turno.nombre ? item.turno.nombre : "-",
                        date: item?.ultima_asistencia_cerrada
                            ? `${getDateStringDMYH(UTCStringToLocalDate(item?.ultima_asistencia_cerrada.fecha_entrada))}`
                            : "",
                    },
                },
                {
                    value: {
                        room: item?.ultima_orden?.orden ? `Orden ${item?.ultima_orden?.orden}` : "Sin asignar",
                        date: item?.ultima_orden?.fecha_registro
                            ? `${getDateStringDMYH(UTCStringToLocalDate(item?.ultima_orden?.fecha_registro))}`
                            : "",
                    },
                },
                {
                    value: {
                        en_turno: item?.en_turno || false,
                        colaborador_id: item?.colaborador_id,
                    },
                },
            ]

            if (rolName === RoleNames.monitoreo) {
                return {
                    goTo: item?.colaborador_id,
                    value: path === "Alimentos y Bebidas" ? baseAliemntos.slice(0, -1) : path === "Recepción" ? baseRecepcion.slice(0, -1) : baseHospedaje.slice(0, -1),
                }
            }

            return {
                goTo: item?.colaborador_id,
                value: path === "Alimentos y Bebidas" ? baseAliemntos : path === "Recepción" ? baseRecepcion : baseHospedaje,
            }
        })
    }

    return { getRowFormat }
}
