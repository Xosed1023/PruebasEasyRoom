import { PDFViewer } from "@react-pdf/renderer"
import TicketCaratula from "../components/TicketCaratula/TicketCaratula"
import { useFetch } from "../../../../shared/hooks/useFetch"
import { useEffect } from "react"
import { useProfile } from "src/shared/hooks/useProfile"
import { useParams } from "react-router-dom"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { CaratulaPeriodoType } from "./caratula-periodo.type"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function CaratulaPeriodo(): JSX.Element {
    const { hotel_id, logo_hotel, nombre_hotel } = useProfile()
    const { formatCustomDate } = useFormatDate()

    const { month = "", year = "" } = useParams()

    const current = new Date()
    const selectedYear = year ? Number(year) : current.getFullYear()
    const selectedMonth = month ? Number(month) + 1 : current.getMonth()
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate()

    const firstDay = formatCustomDate(new Date(selectedYear, Number(month), 1), "DD/MMM/YY")

    const lastDay = formatCustomDate(new Date(selectedYear, Number(month) + 1, 0), "DD/MMM/YY")

    const {
        data: caratula,
        refetch: refetchCaratula,
        load,
    } = useFetch<CaratulaPeriodoType>("/cortes/caratula", {
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

    return !load ? (
        <div style={{ width: "100%", height: "100%" }}>
            <PDFViewer style={{ width: "100%", height: "calc(100dvh - 48px)" }}>
                <TicketCaratula
                    caratula={caratula}
                    firstDay={firstDay}
                    lastDay={lastDay}
                    numDays={numDays}
                    logo_hotel={logo_hotel}
                    nombre_hotel={nombre_hotel?.toUpperCase() || ""}
                />
            </PDFViewer>
        </div>
    ) : (
        <LoaderComponent visible={true} />
    )
}

export default CaratulaPeriodo
