import { useNavigate } from "react-router-dom"
import Icon from "src/shared/icons"
import "./AddButton.css"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"

export const AddButton = () => {
    const navigate = useNavigate()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const { rolName } = useProfile()

    const handleClick = validateIsColabActive(() => {
        navigate("/u/registro-reserva")
    })

    return (
        <>
            {rolName !== RoleNames.monitoreo && (
                <div className="reservas-screen__float-button" onClick={handleClick}>
                    <Icon name="CalendarPlusFilled" color={"#FFF"} width={30} height={30} />
                </div>
            )}
            {InactiveModal}
        </>
    )
}
