import Screen from "@/components/core/layout/screen/Screen"
import Header from "../../components/header/Header"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import formatDateDDMMMYYYY from "@/helpers/formatDateDDMMMYYYY"
import { useEffect, useState } from "react"
import { Hotel } from "@/gql/schema"
import { dateHelpers } from "@/helpers/dateHelpers"
import { useParams } from "react-router"
import TurnCutPDF from "../components/turn-cut-pdf/TurnCutPDF"
import PDFCanvas from "../components/PDFCanvas/PDFCanvas"
import useTurnCutPDF from "../turn-cut-screen/PropinasPage/hooks/useTurnCutPDF"

const RangeCutScreen = () => {
    const [date, setDate] = useState<Date | null>(null)
    const { UTCStringToLocalDate } = dateHelpers()
    const { cut_id = "", hotel_id = "" } = useParams()
    
    const { cortes_pdf, hotelSelected, inventario, reportePropinas, corte } = useTurnCutPDF({
        cut_id,
        hotel_id,
    })

    useEffect(() => {
        if(corte) {
            setDate(UTCStringToLocalDate(corte.fecha_inicio_corte))
        }
    }, [corte])

    return (
        <Screen
            className="gap-y-[20px] flex flex-col mt-[24px]"
            header={<Header title="Corte de turno" onSelectDate={(date) => setDate(date)} withCalendar={false} />}
        >
            <SectionTitle title={date ? formatDateDDMMMYYYY({ date }) : ""} />
            {!!cortes_pdf && !!inventario && (
                <PDFCanvas style={{ height: `calc(100dvh - 180px)` }}>
                    <TurnCutPDF
                        corte={corte}
                        cortes_pdf={cortes_pdf}
                        hotelSelected={hotelSelected as Hotel}
                        reportePropinas={reportePropinas}
                        inventario={inventario}
                    />
                </PDFCanvas>
            )}
        </Screen>
    )
}

export default RangeCutScreen
