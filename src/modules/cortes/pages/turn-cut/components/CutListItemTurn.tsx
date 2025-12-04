import CutListItem from "../../components/cut-list-item/CutListItem"
import { useNavigate } from "react-router"
import { Corte } from "@/gql/schema"

const CutListItemTurn = ({
    cut,
    onSelect,
    loading,
    setIsLoading,
}: {
    cut: Corte
    onSelect: (cut: Corte) => void
    loading: boolean
    setIsLoading: (v: boolean) => void
}) => {
    const navigate = useNavigate()
    return (
        <CutListItem
            loading={loading}
            setIsLoading={setIsLoading}
            onDetails={() => {
                navigate(`pdf/${cut.corte_id}`)
            }}
            onDownload={() => {
                onSelect(cut)
            }}
            title={cut.turno.nombre}
            value={cut.total_corte}
        />
    )
}
export default CutListItemTurn
