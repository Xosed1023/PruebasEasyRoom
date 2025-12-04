import { useNavigate, useParams } from "react-router"
import { Avatar, AvatarImage } from "@/components/ui/avatar/Avatar"
import { useProfile } from "@/hooks/store/useProfile"
import Bell from "@/icons/Bell"
import EasyRoomLogo from "@/icons/EasyRoomLogo"
import EmptyPerfil from "assets/png/empty-perfil.png"
import styles from "./Header.module.css"
import { useGetUsuariosNotificacionesActivosQuery } from "@/gql/schema"

const Header = () => {
    const navigate = useNavigate()
    const { foto, usuario_id } = useProfile()
    const { hotel_id = "" } = useParams()

    const { data } = useGetUsuariosNotificacionesActivosQuery({
        variables: { usuario_id, hotel_id },
    })

    return (
        <div className={`flex w-full justify-between s:px-[35px] xs:px-[20px] py-[20px] items-center`}>
            <Avatar size={32} onClick={() => navigate("/u/profile")}>
                <AvatarImage src={foto || EmptyPerfil} />
            </Avatar>
            <EasyRoomLogo />
            <div className="relative" onClick={() => navigate(`/u/notifications/${hotel_id}`)}>
                {data?.notificaciones_no_leidas_alerta && <div className={styles["header__dot"]}></div>}
                <Bell />
            </div>
        </div>
    )
}

export default Header
