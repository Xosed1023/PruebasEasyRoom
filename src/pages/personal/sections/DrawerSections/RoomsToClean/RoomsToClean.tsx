import { useEffect, useState } from "react"

import "./RoomsToClean.css"
import DrawerWrappper from "src/pages/personal/components/DrawerWrapper/DrawerWrappper"
import DrawerTitle from "src/pages/personal/components/DrawerTitle/DrawerTitle"
import DrawerContent from "src/pages/personal/components/Drawercontent/DrawerContent"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"
import { useDispatch } from "react-redux"
import { Item } from "src/shared/components/data-display/room-tabs/RoomTabs.type"
import { useHabitacionesToMaintenanceOrCleanQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { getTotalTimeHours } from "src/shared/helpers/getTotalTimeHours"
import { useDate } from "src/shared/hooks/useDate"
import { selectPersonalDrawerSection, setHabitacionParaLimpiezaSeleccionada } from "src/store/personal/personal.slice"
import { useColaboradorSelected } from "src/pages/personal/pages/tabla-personal/hooks/useSelected"
import { validStatusToMaintenanceOrClean } from "../RoomsToReassign/helpers/validStatusToMaintenanceOrClean"

const RoomsToClean = ({handleRefetch}: {handleRefetch: () => void}) => {
    const dispatch = useDispatch()
    const { UTCStringToLocalDate } = useDate()
    const { hotel_id } = useProfile()
    const { colaboradorSelected } = useColaboradorSelected()

    const { data } = useHabitacionesToMaintenanceOrCleanQuery({
        variables: {
            hotel_id,
        }
    })

    const [rowTabs, setRowTabs] = useState<Item[]>([])

    const confirmSelectRoom = (selectedRoom: string) => {
        dispatch(
            setHabitacionParaLimpiezaSeleccionada(
                data?.habitaciones.find((h) => h.habitacion_id === selectedRoom) as any
            )
        )
        dispatch(selectPersonalDrawerSection("cleaning-types"))
    }

    useEffect(() => {
        setRowTabs(
            data?.habitaciones
                ?.filter((h) => validStatusToMaintenanceOrClean(h.estado))
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
        <DrawerWrappper hasBackButton>
            <DrawerTitle
                title={`${colaboradorSelected.habitacion_asignada ? "Reasignación" : "Asignación"} de habitación`}
                hasBackButton
            />
            <DrawerContent>
                <div className="room-to-clean__cols">
                    <span className="room-to-clean__cols__label">Habitación</span>
                    <span className="room-to-clean__cols__label">Última asignación</span>
                </div>
                <div className="room-to-clean__tabs">
                    <RoomTabs
                        items={rowTabs}
                        value={""}
                        onChange={(value) => {
                            confirmSelectRoom(value)
                        }}
                    />
                </div>
            </DrawerContent>
        </DrawerWrappper>
    )
}

export default RoomsToClean
