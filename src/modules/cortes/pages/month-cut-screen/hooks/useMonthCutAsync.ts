import { formatDateComplitSlash } from "@/helpers/formatDate-DD-MM-YY"
import { useProfile } from "@/hooks/store/useProfile"
import { useFetch } from "@/modules/cortes/hooks/useFetch"

const useMonthCutAsync = () => {
    const {
        usuario: { hotel },
    } = useProfile()

    const { refetch: refetchCaratula } = useFetch("/cortes/caratula", {
        defaultValue: null,
        startFetch: false,
    })

    const getMontCutData = ({ month = "", year = "", hotel_id = "" }) => {
        const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)

        const current = new Date()
        const selectedYear = year ? Number(year) : current.getFullYear()
        const selectedMonth = month ? Number(month) : current.getMonth()
        const numDays = new Date(selectedYear, selectedMonth, 0).getDate()
        const firstDay = formatDateComplitSlash(new Date(selectedYear, Number(month), 1))
        const lastDay = formatDateComplitSlash(new Date(selectedYear, Number(month) + 1, 0).toString())

        return refetchCaratula({
            hotel_id,
            mes: selectedMonth,
            anio: selectedYear,
        }).then((caratula) => ({
            caratula,
            hotelSelected,
            numDays,
            firstDay,
            lastDay,
        }))
    }

    return { getMontCutData }
}

export default useMonthCutAsync
