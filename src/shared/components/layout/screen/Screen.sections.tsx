import Icon from "src/shared/icons"
import { useNavigate } from "react-router-dom"

export const Back = ({ onBack }: { onBack?: () => void }) => {
    const navigate = useNavigate()
    return (
        <div
            className="screen__head__back"
            onClick={onBack ? onBack : () => navigate(-1)}
        >
            <div className="screen__head__back__icon">
                <Icon name={"arrowLeft"} color={"var(--purple-drawer-primario)"} />
            </div>
            <span>{"Regresar"}</span>
        </div>
    )
}

export const Close = ({ onClose }) => {
    const navigate = useNavigate()

    return (
        <div
            className="screen__close"
            onClick={onClose ? onClose : () => navigate(-1)}
        >
            <Icon name={"close"} color={"var(--purple-drawer-primario)"} width={24} height={24} />
        </div>
    )
}
