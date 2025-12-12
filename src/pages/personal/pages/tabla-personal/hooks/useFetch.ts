import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import {
    selectColaborador,
    selectPersonalDrawerSection,
    togglePersonalTurnoDrawer,
} from "src/store/personal/personal.slice"
import { useColaboradoresPorHotel } from "../TablaPersonal.graphql"
import { useModulos } from "src/shared/hooks/useModulos"
import { puestosConModuloRestaurante, puestosSinModuloRestaurante } from "src/constants/puestos"
import { AreasName } from "src/pages/personal/inicio.constants"
import { Colaborador, Order } from "src/gql/schema"
import { TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

export const getFilterData = (array: any[], restaurante: boolean) => {
    const list: any[] = []
    const orderList = [...array]

    orderList.forEach((item) => {
        const puesto = item.colaborador_in_hotel?.[0]?.puesto?.nombre
        const puestosValidos = restaurante ? puestosConModuloRestaurante : puestosSinModuloRestaurante
        const cantidad_ordenes = item.cantidad_ordenes
        if (puestosValidos.includes(puesto)) {
            const ultima_tarea = {
                habitacion: `${item.ultima_tarea?.habitacion?.tipo_habitacion?.nombre} ${item?.ultima_tarea?.habitacion?.numero_habitacion}`,
                fecha: item?.ultima_tarea?.fecha_inicio,
            }
            const ultima_orden = {
                orden_id: item?.ultima_orden?.orden_id,
                orden: `${item.ultima_orden?.orden}`,
                fecha: item?.ultima_orden?.fecha_registro,
            }
            const { habitacion, isDisponible } = evalDisponibilidadColaborador(item)

            list.push({
                colaborador_id: item?.colaborador_id,
                nombre: `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,
                foto: item?.foto || "",
                puesto,
                habitacion,
                isDisponible,
                asignacion: item?.numero_asignaciones || (habitacion ? 1 : 0),
                cantidad_ordenes: item?.cantidad_ordenes ? cantidad_ordenes : 0,
                ultima_orden: item.ultima_orden ? ultima_orden : null,
                ultima_tarea: item.ultima_tarea ? ultima_tarea : null,
                en_turno: item?.en_turno,
                asistencia_id: item?.asistencia_abierta?.asistencia_id,
                es_supervisor: item?.es_supervisor,
            })
        }
    })

    return list
}

export function evalDisponibilidadColaborador(item: Colaborador): {
    habitacion: string | null
    isDisponible: boolean
} {
    const habitacion = item?.ultima_tarea
        ? !item?.ultima_tarea?.fecha_termino
            ? item?.ultima_tarea?.habitacion?.numero_habitacion
            : null
        : null

    const hasMesaActiva = item?.mesa_asignada_activa?.has_mesa_activa ?? false

    const isDisponible = !habitacion && !hasMesaActiva

    return {
        habitacion: habitacion || null,
        isDisponible,
    }
}

export function useFetch({
    path,
    areas_filter,
    page,
    searchValue
}: {
    path: AreasName
    areas_filter?: string[],
    page: number,
    searchValue
}) {
    const [puestoFilter, setpuestoFilter] = useState<string>("")

    const useColabsPorHotelProps = useMemo(() => ({
        areas_filter,
        pagination_options: {
            order: Order.Asc,
            take: 20,
            page
        },
        searchValue,
        puestoFilter
    }), [page, areas_filter, puestoFilter, searchValue])

    const { colabs, isLoading, refetchColabs } = useColaboradoresPorHotel(useColabsPorHotelProps)

    const dispatch = useDispatch()

    const [data, setData] = useState<Colaborador[]>([])
    const { restaurante } = useModulos()

    useEffect(() => {
        const colaboradores = colabs.data?.colaboradores_by_area.colaboradores || []
        setData(colaboradores as Colaborador[])
    }, [colabs.data, restaurante, path])


    const handleSearch = () => {
        refetchColabs()
    }

    const handleSelectItem = (value) => {
        const findColaborador = colabs.data?.colaboradores_by_area.colaboradores?.find(({ colaborador_id }) => colaborador_id === value)
        dispatch(togglePersonalTurnoDrawer(true))
        dispatch(selectPersonalDrawerSection("home"))
        dispatch(selectColaborador(findColaborador))
    }

    const handleRefetch = () => {
        refetchColabs()
    }

    const handleFilter = (filter: TableFilter[]) => {
        if(!filter.length || filter[0].filter === "Todos") {
            setpuestoFilter("")
            return
        }
        if(filter.length) {
            setpuestoFilter(filter[0].filter)
        }
    }


    return {
        data,
        load: isLoading,
        totalPages: colabs.data?.colaboradores_by_area.paginacion?.total_paginas || 1,
        handleSearch,
        handleSelectItem,
        handleRefetch,
        handleFilter
    }
}
