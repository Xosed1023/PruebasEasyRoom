import { useLocation, useNavigate, useParams } from "react-router"
import Navbar from "./Navbar"

function NavbarNavigator() {
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname.split("/").filter(Boolean)[1]
    const { hotel_id = "" } = useParams()

    return (
        <Navbar
            style={{ position: "fixed", bottom: 0, left: 0 }}
            items={[
                { label: "Home", icon: "Home", value: "home", path: `home/${hotel_id}` },
                { label: "Cortes", icon: "CoinFill", value: "cortes", activeIcon: "Coin", path: `cortes/${hotel_id}` },
                { label: "Gastos", icon: "Wallet", value: "expenses", path: `expenses/${hotel_id}` },
                { label: "Incidencias", icon: "AlertLine", value: "incidences", activeIcon: "AlertFill", path: `incidences/${hotel_id}` },
            ]}
            value={path}
            onChange={(value) => navigate(`/u/${value}`)}
        />
    )
}

export default NavbarNavigator
