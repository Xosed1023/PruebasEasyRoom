import { useLogoutMutation } from "@/gql/schema"
import { useProfile } from "@/hooks/store/useProfile"
import useSnackbar from "@/hooks/useSnackbar"
import EasyRoomLogo from "@/icons/EasyRoomLogo"
import Logout from "@/icons/Logout"
import { onClearSession } from "@/utils/session"
import { useNavigate } from "react-router"

const Header = ({ onLogout }) => {
    const [logout] = useLogoutMutation()
    const { handleProfile } = useProfile()
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()

    const handleLogout = () => {
        onLogout()
        logout()
            .then(({ data }) => {
                if (data?.logout) {
                    handleProfile()
                    onClearSession()
                    navigate("/", { replace: true })
                }
            })
            .catch((e) => {
                showSnackbar({
                    status: "error",
                    title: "Error al cerrar sesión",
                    text: "No fue posible cerrar sesión.\nInténtalo de nuevo.",
                })
                console.log(e)
            })
    }

    return (
        <div className="flex items-center justify-between h-full px-[35px]">
            <EasyRoomLogo height={26} width={153} />
            <Logout color="var(--primary)" width={24} height={24} onClick={handleLogout} />
        </div>
    )
}

export default Header
