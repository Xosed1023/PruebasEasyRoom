import { gql, useQuery } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import Touchable from "src/shared/components/general/touchable/Touchable"
import Icon from "src/shared/icons"
import { useProfile } from "src/shared/hooks/useProfile"

const QUERY = gql`
    query ($hotel_id: ID, $estatus: EstatusCorte) {
        cortes(hotel_id: $hotel_id, estatus: $estatus) {
            corte_id
        }
    }
`

const date = new Date()

const Clock = () => {
    const navigate = useNavigate()
    const { hotel_id } = useProfile()

    const { data } = useQuery(QUERY, {
        variables: {
            hotel_id,
            fecha_inicio_corte: {
                fecha_inicial: new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(),
                fecha_final: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).toISOString(),
            },
            estatus: "pendiente",
        },
    })

    return (
        <Touchable className="cortes-screen__header-icon" onClick={() => navigate("/u/cortes/pendientes")}>
            {data?.cortes && data?.cortes?.length > 0 ? <div className="cortes-screen__header-icon-dot"></div> : null}
            <Icon name={"currencyFill"} color="#0E0E0E" height={"20px"} width={"20px"} />
        </Touchable>
    )
}

export default Clock
