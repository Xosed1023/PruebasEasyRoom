/* eslint-disable indent */
import { Document } from "@react-pdf/renderer"
import { CaratulaPeriodoType } from "./caratula-periodo.type"
import Ingresos from "./pages/Ingresos"
import TotalIngresosPage from "./pages/TotalIngresos"
import GastosPage from "./pages/Gastos"
import MetodosPagos from "./pages/MetodosPagos"

const MonthCutPDF = ({
    caratula,
    firstDay,
    lastDay,
    numDays,
    logo_hotel = "",
    nombre_hotel = "",
}: {
    caratula: CaratulaPeriodoType
    firstDay: string
    lastDay: string
    numDays: number
    logo_hotel: string
    nombre_hotel: string
}) => {
    return (
        <Document title="Carátula">
            <Ingresos
                caratula={caratula}
                firstDay={firstDay}
                lastDay={lastDay}
                logo_hotel={logo_hotel}
                nombre_hotel={nombre_hotel}
                numDays={numDays}
            />
            <TotalIngresosPage
                caratula={caratula}
                firstDay={firstDay}
                lastDay={lastDay}
                logo_hotel={logo_hotel}
                nombre_hotel={nombre_hotel}
                numDays={numDays}
            />
            <GastosPage
                caratula={caratula}
                firstDay={firstDay}
                lastDay={lastDay}
                logo_hotel={logo_hotel}
                nombre_hotel={nombre_hotel}
                numDays={numDays}
            />
            <MetodosPagos
                caratula={caratula}
                firstDay={firstDay}
                lastDay={lastDay}
                logo_hotel={logo_hotel}
                nombre_hotel={nombre_hotel}
                numDays={numDays}
            />
        </Document>
    )
}

export default MonthCutPDF
