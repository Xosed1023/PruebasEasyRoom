import { RoomStatus } from "../../components/RoomCard/enums/RoomStatus.enum"
import { useRoom } from "../hooks"
import Clean from "./Clean"
import Demo from "./demo"
import Ocupada from "./ocupada"
import Venta from "./venta"
import Sucia from "./sucia"
import PendienteSupervision from "./pendiente-supervision"
import Supervision from "./supervision"
import Mantenimiento from "./mantenimiento"
import Bloqueada from "./bloqueda"
import Reservada from "./reservada"
import Limpieza from "./limpieza"
import "./general/index.css"

function DrawerNavigator(): JSX.Element {
    const { estado } = useRoom()
    return (
        <>
            {estado === RoomStatus.available ? (
                <Venta />
            ) : estado === RoomStatus.clean ? (
                <Clean />
            ) : estado === RoomStatus.occupied ? (
                <Ocupada />
            ) : estado === RoomStatus.roomService ? (
                <Ocupada />
            ) : estado === RoomStatus.unclean ? (
                <Sucia />
            ) : estado === RoomStatus.supervisionPending ? (
                <PendienteSupervision />
            ) : estado === RoomStatus.supervision ? (
                <Supervision />
            ) : estado === RoomStatus.maintenance ? (
                <Mantenimiento />
            ) : estado === RoomStatus.reserved ? (
                <Reservada />
            ) : estado === RoomStatus.blocked ? (
                <Bloqueada />
            ) : estado === RoomStatus.cleaning ? (
                <Limpieza />
            ) : (
                <Demo />
            )}
        </>
    )
}

export default DrawerNavigator
