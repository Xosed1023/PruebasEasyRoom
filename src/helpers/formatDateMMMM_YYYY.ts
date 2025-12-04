import { formatDate } from "date-fns"
import { es } from "date-fns/locale"

const formatDateMMMM_YYYY = ({ date, capitalize = true }: { date: Date; capitalize?: boolean }) => {
    const formattedDate = formatDate(date, "MMMM yyyy", { locale: es })
    return capitalize ? formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1) : formattedDate
}

export default formatDateMMMM_YYYY
