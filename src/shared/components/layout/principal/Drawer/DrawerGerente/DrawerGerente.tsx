import OcupacionWidget from "src/shared/widgets/Ocupación/OcupacionWidget"
import EstatusDeHabitaciones from "src/shared/widgets/estatusDeHabitaciones/EstatusDeHabitaciones"
import { useDrawerData } from "src/shared/widgets/hooks"
import { useTotals } from "src/shared/widgets/hooks/totals"
import { useDataByOccupied } from "src/shared/widgets/hooks/rentas"
import IncidenciasDelDiaWitd from "src/shared/widgets/incidenciasDelDiaWitd"
import IngresoTotalWithdhet from "src/shared/widgets/ingresoTotalWithdhet/IngresoTotalWithdhet"
import PersonalActivoEnTUrnoWit from "src/shared/widgets/personalActivoEnTUrnoWit/PersonalActivoEnTUrnoWit"
import VentasDeHabitacionWidget from "src/shared/widgets/ventasDeHabitacionWitdget/ventasDeHabitacionWitdget"

const DrawerGerente = () => {
    const { getOccupiedData, getSoldRoomsData, monthPercent, handleMonthPercent } = useDataByOccupied()
    const { incidencias, colaboradores } = useDrawerData()
    const occupiedData = getOccupiedData()
    const { rooms, mostrador, reserva, acumulada } = getSoldRoomsData()
    const { total, data } = useTotals()

    const getColaboradores = () => {
        const array = Object.values(colaboradores).flat(1)

        return {
            personalAsignado: array.filter(({ disponible }) => !disponible),
            personalDisponible: array.filter(({ disponible }) => disponible),
        }
    }

    const { personalAsignado, personalDisponible } = getColaboradores()

    return (
        <div className="drawerWidget__main-gerente">
            <IngresoTotalWithdhet total={total} data={data} />
            <EstatusDeHabitaciones />
            <div className="drawerWidget__container" style={{ marginRight: "20px" }}>
                <OcupacionWidget
                    {...occupiedData}
                    monthPercent={monthPercent}
                    onChange={(value) => {
                        if (value === "month" && monthPercent === 0) handleMonthPercent()
                    }}
                />
                <PersonalActivoEnTUrnoWit personalAsignado={personalAsignado} personalDisponible={personalDisponible} />
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

export default DrawerGerente
