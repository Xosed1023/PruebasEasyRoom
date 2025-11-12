import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { useRoom } from "../../hooks"
import { useNavigate } from "react-router-dom"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function IncidenciasItem(): JSX.Element | null {
    const room = useRoom()
    const navigate = useNavigate()
    const { rolName } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    return (
        rolName === "VALETPARKING" || rolName === "ROOMSERVICE" || rolName === "RESTAURANTE"
            ? room?.incidencias_activas_usuario
            : room?.incidencias_activas
    ) ? (
        <>
            <DescriptionDetail
                icon="alertFill"
                iconStyle={{
                    color: "var(--orange-warning)",
                }}
                label="Incidencias abiertas"
                link="Ver"
                onLink={validateIsColabActive(() => navigate(`/u/incidencias-activas/${room?.habitacion_id}`))}
                style={{
                    width: "100%",
                    padding: "12px",
                }}
                value={
                    rolName === "VALETPARKING" || rolName === "ROOMSERVICE" || rolName === "RESTAURANTE"
                        ? room?.incidencias_activas_usuario
                        : room?.incidencias_activas
                }
            />
            {InactiveModal}
        </>
    ) : null
}

export default IncidenciasItem
