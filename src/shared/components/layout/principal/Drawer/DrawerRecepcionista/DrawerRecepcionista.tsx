import OcupacionWidget from "src/shared/widgets/Ocupación/OcupacionWidget"
import EstatusDeHabitaciones from "src/shared/widgets/estatusDeHabitaciones/EstatusDeHabitaciones"
import { useDrawerData } from "src/shared/widgets/hooks"
import { usePendingPayments } from "src/shared/widgets/hooks/payments"
import { useDataByOccupied } from "src/shared/widgets/hooks/rentas"
import IncidenciasDelDiaWitd from "src/shared/widgets/incidenciasDelDiaWitd"
import PendientesDePagoWit from "src/shared/widgets/pendientesDePagoWit/PendientesDePagoWit"
import PersonalActivoWidget from "src/shared/widgets/personalActivoWidget/PersonalActivoWidget"
import VentasDeHabitacionWidget from "src/shared/widgets/ventasDeHabitacionWitdget/ventasDeHabitacionWitdget"

const DrawerRecepcionista = () => {
    const { getOccupiedData, getSoldRoomsData, monthPercent, handleMonthPercent } = useDataByOccupied()
    const { incidencias, colaboradores } = useDrawerData()

    const occupiedData = getOccupiedData()
    const { rooms, mostrador, reserva, acumulada } = getSoldRoomsData()
    const { roomServiceTotal, roomServiceSize, estanciaTotal, estanciaSize } = usePendingPayments()

    return (
        <div className="drawerWidget__main-recepcion">
            <EstatusDeHabitaciones />
            <PersonalActivoWidget
                meseros={colaboradores.meseros}
                camarista={colaboradores.camaritas}
                mantenimiento={colaboradores.mantenimiento}
            />
            <div className="drawerWidget__container" style={{ marginRight: "20px" }}>
                <OcupacionWidget
                    {...occupiedData}
                    monthPercent={monthPercent}
                    onChange={(value) => {
                        if (value === "month" && monthPercent === 0) handleMonthPercent()
                    }}
                />
                <PendientesDePagoWit
                    cantidadRoomService={roomServiceSize}
                    pagoRoomService={roomServiceTotal}
                    cantidadEstancia={estanciaSize}
                    pagoEstancia={estanciaTotal}
                />
            </div>
            <div className="drawerWidget__container">
                <VentasDeHabitacionWidget
                    rooms={rooms}
                    reserva={{
                        aPie: reserva.pie,
                        coche: reserva.coche,
                        percent: reserva.percent,
                    }}
                    mostrador={{
                        aPie: mostrador.pie,
                        coche: mostrador.coche,
                        percent: mostrador.percent,
                    }}
                    acumulada={acumulada}
                />
                <IncidenciasDelDiaWitd {...incidencias} />
            </div>
        </div>
    )
}

export default DrawerRecepcionista
