import CutListItem from "../../components/cut-list-item/CutListItem"
import { useNavigate } from "react-router"
import { Corte } from "@/gql/schema"

const CutListItemRange = ({
    cut,
    onSelect,
}: {
    cut: Corte
    onSelect: (cut: Corte) => void
}) => {
    const navigate = useNavigate()
    return (
        <CutListItem
            loading={false}
            setIsLoading={() => 1}
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
export default CutListItemRange
