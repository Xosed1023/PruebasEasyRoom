import Empty from "src/shared/components/data-display/empty/Empty"
import { PrimaryButton } from "../../../sections/elements/Elements"
import { useNavigate } from "react-router-dom"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { useRoomDarwer } from "../../../hooks/darwer"

export const EmptyColaborador = ({ title = "", className = "" }) => {
    const navigate = useNavigate()
    const { onClose } = useRoomDarwer()
    const rol = useCurrentRol()
    const complete = rol === "ADMINISTRADOR"

    const handle = () => {
        onClose()
        navigate("/u/personal")
    }

    return (
        <div className={`${className} animante__opacity-transform__ease`}>
            <Empty
                className={`detalle-h-general__empty-${complete ? "complete" : "simple"}`}
                theme={"dark"}
                title={`${title}${!complete ? ". \nContacta a tu administrador." : ""}`}
                icon={"userFilled"}
            />
            {complete && <PrimaryButton text="Administrar personal" onClick={handle} />}
        </div>
    )
}
