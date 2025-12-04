import Screen from "@/components/core/layout/screen/Screen"
import { useEffect } from "react"
import { useParams } from "react-router"
import Header from "../../components/header/Header"
import NavbarNavigator from "@/components/core/navigation/navbar"
import { formatDateComplitSlash } from "@/helpers/formatDate-DD-MM-YY"
import { useFetch } from "../../hooks/useFetch"
import PDFCanvas from "../components/PDFCanvas/PDFCanvas"
import MonthCutPDF from "../components/month-cut-pdf/MonthCutPDF"
import { useProfile } from "@/hooks/store/useProfile"

const MonthCutScreen = () => {
    const { month = "", year = "", hotel_id = "" } = useParams()
    const {
        usuario: { hotel },
    } = useProfile()
    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)
    
    const current = new Date()
    const selectedYear = year ? Number(year) : current.getFullYear()
    const selectedMonth = month ? Number(month) : current.getMonth()
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate()
    const firstDay = formatDateComplitSlash(new Date(selectedYear, Number(month), 1))
    const lastDay = formatDateComplitSlash(new Date(selectedYear, Number(month) + 1, 0).toString())

    const {
        data: caratula,
        refetch: refetchCaratula,
        load,
    } = useFetch("/cortes/caratula", {
        defaultValue: null,
        startFetch: false,
    })

    useEffect(() => {
        if (hotel_id && selectedMonth && selectedYear) {
            refetchCaratula({
                hotel_id,
                mes: selectedMonth,
                anio: selectedYear,
            })
        }
    }, [hotel_id, selectedMonth, selectedYear])

    return (
        <Screen
            className="gap-y-[20px] flex flex-col mt-[24px]"
            header={<Header title="Reportes mensuales" withCalendar={false} />}
            footer={<NavbarNavigator />}
        >
            {!load && (
                <PDFCanvas style={{ height: `calc(100dvh - 180px)` }}>
                    <MonthCutPDF
                        caratula={caratula}
                        firstDay={firstDay}
                        lastDay={lastDay}
                        numDays={numDays}
                        logo_hotel={hotelSelected?.logo_hotel || ""}
                        nombre_hotel={hotelSelected?.nombre_hotel?.toUpperCase() || ""}
                    />
                </PDFCanvas>
            )}
        </Screen>
    )
}

export default MonthCutScreen
