import cx from "classnames"
import AuthPinComponent from "src/shared/components/modal/sections/AuthModal/AuthPinComponent"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useEffect, useState } from "react"

type AuthProps = {
    onLoading: () => void
    onBack: () => void
    onAuthConfirm: () => void
    visible: boolean
}

function Auth({ onLoading, onAuthConfirm, onBack, visible = false }: AuthProps): JSX.Element {
    const [show, setShow] = useState<boolean>(false)
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setShow(true)
            }, 500)
        }

        setShow(false)
    }, [visible])
    return (
        <section className={cx("cortes__cancelacion__view cortes__cancelacion__auth")}>
            <div className="cortes__cancelacion__back" onClick={onBack}>
                <Icon name={"ChevronFill"} height={18} width={11} color={"var(--primary)"} />
            </div>
            <IconBorder
                primaryBgColor="var(--primary)"
                secondaryBgColor="var(--fondo-close)"
                primaryBgDiameter={30}
                secondaryBgDiameter={60}
                className="cortes__cancelacion__border"
            >
                <Icon name="LockFill" color="var(--white)" width={16} height={16} />
            </IconBorder>
            <div className="cortes__cancelacion__auth-row">
                <p className="cortes__cancelacion__auth-title">{"Autorización requerida"}</p>
                <span className="cortes__cancelacion__auth-description">
                    Introduce el código de autorización o coloca tu huella en el lector para autorizar el proceso.
                </span>
            </div>
            {show && (
                <AuthPinComponent
                    isOpen={true}
                    onLoading={onLoading}
                    onAuthFilled={() => onAuthConfirm()}
                    authorizedPins={[RoleNames.superadmin, RoleNames.admin]}
                    authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista]}
                />
            )}
        </section>
    )
}

export default Auth
