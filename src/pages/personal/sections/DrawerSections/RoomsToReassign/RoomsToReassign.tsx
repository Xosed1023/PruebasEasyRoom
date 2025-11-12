import { useEffect, useState } from "react"

import "./RoomsToReassign.css"
import DrawerWrappper from "src/pages/personal/components/DrawerWrapper/DrawerWrappper"
import DrawerTitle from "src/pages/personal/components/DrawerTitle/DrawerTitle"
import DrawerContent from "src/pages/personal/components/Drawercontent/DrawerContent"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"
import { useDispatch } from "react-redux"
import { Item } from "src/shared/components/data-display/room-tabs/RoomTabs.type"
import {
    Colaborador,
    Estados_Habitaciones,
    Habitacion,
    useCambiarTareaDeHabitacionMutation,
    useHabitacionesToMaintenanceOrCleanQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { getTotalTimeHours } from "src/shared/helpers/getTotalTimeHours"
import { useDate } from "src/shared/hooks/useDate"
import { setColaboradores, togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import { useColaboradorSelected } from "src/pages/personal/pages/tabla-personal/hooks/useSelected"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { getSnackbarText } from "./helpers/snackbarText"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useColaboradoresPorHotelLazy } from "src/pages/personal/pages/tabla-personal/TablaPersonal.graphql"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { validStatusToMaintenanceOrClean } from "./helpers/validStatusToMaintenanceOrClean"

const RoomsToReassign = ({tipoTarea, handleRefetch}: {tipoTarea: "mantenimiento" | "limpieza", handleRefetch: () => void}) => {
    const { hotel_id, usuario_id } = useProfile()
    const { UTCStringToLocalDate } = useDate()
    const { showSnackbar } = useSnackbar()
    const { colaboradorSelected } = useColaboradorSelected()
    const dispatch = useDispatch()
    const [cambiarTareaDeHabitacion] = useCambiarTareaDeHabitacionMutation()
    const [roomToReassingSelected, setroomToReassingSelected] = useState<Habitacion>()
    const { getColaboradores } = useColaboradoresPorHotelLazy()
    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const { data } = useHabitacionesToMaintenanceOrCleanQuery({
        variables: {
            hotel_id,
        },
    })
    const [rowTabs, setRowTabs] = useState<Item[]>([])

    const confirmSelectRoomToReassign = () => {
        if(isLoading) {
            return
        }
        toggleIsLoading({value: true})
        cambiarTareaDeHabitacion({
            variables: {
                datos_cambio: {
                    habitacion_id: roomToReassingSelected?.habitacion_id || "",
                    usuario_id,
                    estado_habitacion_actual: Estados_Habitaciones.SupervisionPendiente,
                    estado_habitacion_nueva: tipoTarea === "mantenimiento" ? Estados_Habitaciones.Mantenimiento : Estados_Habitaciones.Limpieza,
                    switch_colaboradores: [{
                        colaborador_id: colaboradorSelected.colaborador_id || "",
                        colaborador_tarea_id: colaboradorSelected?.ultima_tarea?.colaborador_tarea_id || ""
                    }]
                },
            },
        })
            .then(() => {
                dispatch(togglePersonalTurnoDrawer(false))
                showSnackbar({
                    title: "Mantenimiento de habitación",
                    text: getSnackbarText({
                        colaborador: colaboradorSelected as Colaborador,
                        room: roomToReassingSelected,
                        status: tipoTarea
                    }),
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al asignar personal",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                toggleIsLoading({value: false})
                getColaboradores()
                    .then((colaboradores) => dispatch(setColaboradores(colaboradores.data?.colaboradores)))
                    .catch((e) => console.log(e))
            })
    } 

    useEffect(() => {
        setRowTabs(
            data?.habitaciones
                ?.filter((h) => validStatusToMaintenanceOrClean(h.estado))
                ?.filter((h) => !h?.colaborador_tareas_sin_finalizar?.length)
                ?.sort((a, b) => Number(a?.numero_habitacion) - Number(b?.numero_habitacion))
                ?.map((habitacion) => ({
                    label: habitacion.numero_habitacion,
                    value: habitacion.habitacion_id,
                    timer: `${getTotalTimeHours(
                        UTCStringToLocalDate(habitacion.ultimos_datos?.ultima_limpieza?.[0]?.fecha_inicio),
                        new Date()
                    )} horas`,
                })) || []
        )
    }, [data])

    return (
        <DrawerWrappper hasBackButton footerChildren={
            <PrimaryButton text="Reasignar habitación" onClick={() => confirmSelectRoomToReassign()} disabled={!roomToReassingSelected || isLoadingDelayed} />
        }>
            <DrawerTitle
                title={`Reasignación de habitación para ${tipoTarea}`}
                hasBackButton
            />
            <DrawerContent>
                <div className="room-to-reassign__cols">
                    <span className="room-to-reassign__cols__label">Habitación</span>
                    <span className="room-to-reassign__cols__label">Última asignación</span>
                </div>
                <div className="room-to-reassign__tabs">
                    <RoomTabs
                        items={rowTabs}
                        value={roomToReassingSelected?.habitacion_id || ""}
                        onChange={(value) => {
                            const room = data?.habitaciones.find((h) => h.habitacion_id === value)
                            setroomToReassingSelected(room as Habitacion)
                        }}
                    />
                </div>
            </DrawerContent>
            <LoaderComponent visible={isLoading} />
        </DrawerWrappper>
    )
}

export default RoomsToReassign
