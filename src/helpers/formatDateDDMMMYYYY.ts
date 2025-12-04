import { formatDate } from "date-fns"
import { es } from "date-fns/locale"

const formatDateDDMMMYYYY = ({ date, capitalize = true }: { date: Date; capitalize?: boolean }) => {
    const formattedDate = formatDate(date, "dd/MMM/yyyy", { locale: es })
    return capitalize ? formattedDate.replace(/\/([a-zñ])/i, (p1) => "" + p1.toUpperCase()) : formattedDate
}

export default formatDateDDMMMYYYY
