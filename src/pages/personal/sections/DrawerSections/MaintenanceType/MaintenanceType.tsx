import React, { useState } from "react"

import "./MaintenanceType.css"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"
import DrawerWrappper from "src/pages/personal/components/DrawerWrapper/DrawerWrappper"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { useDispatch, useSelector } from "react-redux"
import { useColaboradorSelected } from "src/pages/personal/pages/tabla-personal/hooks/useSelected"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Estados_Habitaciones, TiposTarea } from "src/gql/schema"
import { togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import { assignColaborador } from "src/pages/home/room-detail/helpers/colaborador"
import { RootState } from "src/store/store"
import DrawerTitle from "src/pages/personal/components/DrawerTitle/DrawerTitle"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useTiposMantenimientoContext } from "src/shared/providers/TiposMantenimientoProvider"

function MaintenanceType({handleRefetch}: {handleRefetch: () => void}) {
    const dispatch = useDispatch()
    const { roomToMaintenaceSelected } = useSelector((root: RootState) => root.personal)
    const { colaboradorSelected } = useColaboradorSelected()
    const { usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const [maintenanceReasonSelected, setmaintenanceReasonSelected] = useState("")
    const { tiposMantenimiento } = useTiposMantenimientoContext()

    const confirmSelectRoom = () => {
        if (!roomToMaintenaceSelected || isLoading) {
            return
        }
        toggleIsLoading({ value: true })
        assignColaborador({
            datos_tarea: {
                nombre: "Mantenimiento de habitación",
                descripcion: maintenanceReasonSelected,
                puesto_id: colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.puesto_id || "",
                tipo: TiposTarea.Mantenimiento,
            },
            datos_colaborador_tarea: {
                colaborador_ids: [colaboradorSelected?.colaborador_id || ""],
                descripcion_tarea: maintenanceReasonSelected,
                habitacion_id: roomToMaintenaceSelected?.habitacion_id || "",
            },
            usuario_id,
            estadoHabitacion: Estados_Habitaciones.Mantenimiento,
        })
            .then(() => {
                dispatch(togglePersonalTurnoDrawer(false))
                showSnackbar({
                    title: "Mantenimiento de habitación",
                    text: `**${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}** comenzará con el **mantenimiento** en la habitación **${roomToMaintenaceSelected?.tipo_habitacion?.nombre} ${roomToMaintenaceSelected?.numero_habitacion}.**`,
                    status: "success",
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al asignar personal",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                dispatch(togglePersonalTurnoDrawer(false))
                toggleIsLoading({ value: false })
                handleRefetch()
            })
    }

    return (
        <DrawerWrappper
            hasBackButton
            footerChildren={
                <PrimaryButton
                    text="Continuar"
                    onClick={() => {
                        confirmSelectRoom()
                    }}
                    disabled={!maintenanceReasonSelected || isLoadingDelayed}
                />
            }
        >
            <DrawerTitle title={"Motivo de mantenimiento"} hasBackButton />
            <div>
                <div className="personal-detail--clean__maintenance__type-list">
                    <RoomTabs
                        items={tiposMantenimiento.map((m) => ({
                            label: m.nombre,
                            value: m.nombre,
                        }))}
                        onChange={(v) => setmaintenanceReasonSelected(v)}
                        value={maintenanceReasonSelected}
                    />
                </div>
            </div>
        </DrawerWrappper>
    )
}

export default MaintenanceType
