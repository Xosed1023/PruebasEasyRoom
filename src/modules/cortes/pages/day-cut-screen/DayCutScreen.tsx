import Screen from "@/components/core/layout/screen/Screen"
import Header from "../../components/header/Header"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import formatDateDDMMMYYYY from "@/helpers/formatDateDDMMMYYYY"
import { useMemo, useState } from "react"
import { Hotel } from "@/gql/schema"
import { useLocation, useParams } from "react-router"
import PDFCanvas from "../components/PDFCanvas/PDFCanvas"
import DayCutPDF from "../components/day-cut-pdf/DayCutPDF"
import { dateHelpers } from "@/helpers/dateHelpers"
import useDayCutPDF from "./hooks/useDayCutPDF"

const DayCutScreen = () => {
    const [date, setDate] = useState<Date | null>(null)
    const { UTCStringToLocalDate } = dateHelpers()
    const { state } = useLocation()
    const { cut_dates = "", hotel_id = "" } = useParams()
    const dates = useMemo(() => cut_dates.split("&").map((d) => UTCStringToLocalDate(d)), [cut_dates])

    const { cortes_pdf, hotelSelected, inventario } = useDayCutPDF({
        dates,
        hotel_id,
    })

    const folios = state.cortes.map((c) => String(c.folio || ""))

    return (
        <Screen
            className="gap-y-[20px] flex flex-col mt-[24px]"
            header={<Header  title="Corte de día" onSelectDate={(date) => setDate(date)} withCalendar={false} />}
        >
            <SectionTitle title={date ? formatDateDDMMMYYYY({ date }) : ""} />
            {!!cortes_pdf && !!inventario && (
                <PDFCanvas style={{ height: `calc(100dvh - 180px)` }}>
                    <DayCutPDF
                        folios={folios}
                        dates={dates}
                        cortes_pdf={cortes_pdf}
                        hotelSelected={hotelSelected as Hotel}
                        inventario={inventario}
                    />
                </PDFCanvas>
            )}
        </Screen>
    )
}

export default DayCutScreen
