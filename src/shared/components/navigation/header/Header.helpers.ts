import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { clearSession } from "src/utils/session"

export const useOnLogout = () => {
    const navigate = useNavigate()
    const [logout] = useLogoutMutation()
    const { hotel_id } = useProfile()

    const onLogout = () => {
        const sesion_id = sessionStorage.getItem("@sesion_id") || ""
        logout({
            variables: {
                hotel_id,
                cerrar_turno: false,
                sesion_id,
            },
        })
            .then(() => {
                clearSession()
                navigate("/", { replace: true })
            })
            .catch((e) => {
                console.log(e)
            })
    }

    return {
        onLogout,
    }
}
