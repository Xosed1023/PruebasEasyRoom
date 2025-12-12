import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthRequiredModal from "../../modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"

function AuthPinWrapper({
    children,
    authorizedRoles,
    skipRoles,
    authorizedPins
}: {
    children: any
    authorizedRoles: RoleNames[]
    skipRoles: RoleNames[]
    authorizedPins?: RoleNames[]
}): JSX.Element {
    const [visible, setVisible] = useState<boolean>(true)
    const [isAuthorized, setisAuthorized] = useState(false)
    const navigate = useNavigate()

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización requerida"
                onClose={() => {
                    setVisible(false)
                    navigate(-1)
                }}
                onAuthFilled={() => {
                    setisAuthorized(true)
                    setVisible(true)
                }}
                isOpen={visible}
                authorizedRoles={authorizedRoles}
                authorizedPins={authorizedPins}
            />
        ),
        noNeedAuthModalRoles: skipRoles,
        authorizedRoles,
        isOpen: visible,
        onClose: () => {
            setVisible(false)
            navigate(-1)
        },
    })

    return skip ? children : !isAuthorized ? Modal : children
}

export default AuthPinWrapper
