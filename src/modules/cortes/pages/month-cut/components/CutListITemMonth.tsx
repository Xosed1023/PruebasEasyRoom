import CutListItem from "../../components/cut-list-item/CutListItem"
import { useNavigate } from "react-router"

const CutListItemMonth = ({
    onSelect,
    month,
    year,
    title,
    value,
    loading,
    setIsLoading
}: {
    month: number,
    year: string
    title: string,
    value: number
    loading: boolean
    setIsLoading: (v: boolean) => void
    onSelect: (date: {month: string, year: string}) => void
}) => {

    const navigate = useNavigate()
    return (
        <CutListItem
            loading={loading}
            setIsLoading={setIsLoading}
            onDetails={() => {
                navigate(`pdf/${month + 1}/${year}`)
            }}
            onDownload={() => {
                onSelect({month: String(month + 1), year})
            }}
            title={title}
            value={value}
        />
    )
}
export default CutListItemMonth
