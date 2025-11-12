import { useNavigate, useLocation, Navigate } from "react-router-dom/dist/index"
import { useDispatch } from "react-redux"
import NavMenu from "./NavMenu"
import { paths } from "./constants/paths"
import { removeSavedProducts } from "src/pages/room-service/detalle-compra/DetalleCompra.helpers"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { togglePersonalDrawer } from "src/store/personal/personal.slice"
import {
    baseRoutes,
    baseSinReservasRoutes,
    restaurantRoutes,
    valetRoutes,
    roomServiceRoutes,
    restauranteRoutes,
    mantenimientoRoutes,
    monitoreoRoutes,
} from "./constants/routes"
import { useModulos } from "src/shared/hooks/useModulos"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"

function Navbar(): JSX.Element | null {
    const navigate = useNavigate()
    const location = useLocation()
    const pathList = location.pathname.split("/")

    const dispatch = useDispatch()
    const { restaurante, reserva, loading } = useModulos()
    const { rolName } = useProfile()

    const visible =
        !loading && rolName !== RoleNames.cocina && (location.pathname === "/u" || paths.includes(pathList?.at(2) || ""))

    if (rolName === RoleNames.cocina  && location.pathname === "/u") {
        return <Navigate to="/u/cocina" replace />
    }
    const handleChange = (value: string) => {
        navigate(value)
        dispatch(toggleDrawer(false))
        dispatch(togglePersonalDrawer(false))
        if (value === "/u/room-service-home") removeSavedProducts()
    }

    const routes =
        rolName === RoleNames.valet
            ? valetRoutes
            : rolName === RoleNames.roomService
            ? roomServiceRoutes
            : rolName === RoleNames.restaurante
            ? restauranteRoutes
            : rolName === RoleNames.mantenimiento
            ? mantenimientoRoutes
            : rolName === RoleNames.monitoreo
            ? monitoreoRoutes
            : restaurante
            ? restaurantRoutes
            : reserva
            ? baseRoutes
            : baseSinReservasRoutes

    return visible ? <NavMenu routes={routes} value={location.pathname} onChange={handleChange} /> : null
}

export default Navbar
