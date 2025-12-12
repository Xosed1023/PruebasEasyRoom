import React from "react"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"

import "./MaintenanceType.css"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"
import { useTiposMantenimientoContext } from "src/shared/providers/TiposMantenimientoProvider"

function MaintenanceType({ onConfirm }: { onConfirm: (motivo: string) => void }) {
    const { tiposMantenimiento } = useTiposMantenimientoContext()

    return (
        <ListView title={"Motivo de mantenimiento"}>
            <div>
                <div className="room-detail--clean__maintenance__type-list">
                    <RoomTabs
                        items={tiposMantenimiento.map((m) => ({
                            label: m.nombre,
                            value: m.nombre,
                        }))}
                        onChange={(v) => onConfirm(v)}
                        value={""}
                    />
                </div>
            </div>
        </ListView>
    )
}

export default MaintenanceType
