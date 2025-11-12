import { useDispatch, useSelector } from "react-redux"
import { tabsDrawer } from "src/pages/reservaciones/inicio/Inicio.constants"
import AsignacionReservacionesTabDetalle from "src/pages/reservaciones/reservaciones/drawer/asignacion-reservaciones-tab-detalle/AsignacionReservacionesTabDetalle"
import AsignacionReservacionesTabPago from "src/pages/reservaciones/reservaciones/drawer/asignacion-reservaciones-tab-pago/AsignacionReservacionesTabPago"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { RootState } from "src/store/store"

import "./TabsNavigation.css"
import { GetReservacionesTableQuery } from "src/gql/schema"
import { selectDrawerSection } from "src/store/reservations/reservationsSlice"

export const TabsNavigation = ({
    reserva,
}: {
    reserva: GetReservacionesTableQuery["reservas"][0]
    asignada: boolean
}) => {
    const { drawerSelectedSection } = useSelector((state: RootState) => state.reservations)

    const dispatch = useDispatch()
    return (
        <>
            <TabMenu
                className="reservas-screen__tabs__navigation"
                darkMode={true}
                value={drawerSelectedSection}
                tabList={ tabsDrawer}
                onChange={(value) => dispatch(selectDrawerSection(value as any))}
            />
            {drawerSelectedSection === "detail" ? (
                <AsignacionReservacionesTabDetalle sentReservaD={reserva} /> 
            ) : 
            drawerSelectedSection === "payments" ? (
                    <AsignacionReservacionesTabPago sentReservaD={reserva} />
            ) : null}
        </>
    )
}
