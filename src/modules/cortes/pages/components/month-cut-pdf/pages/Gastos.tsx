import { Page, View } from "@react-pdf/renderer"
import { styles } from "../TicketCaratulaStyles"
import Footer from "../sections/footer/Footer"
import Header from "../sections/header/Header"
import GastosAdministrativos from "../sections/tables/GastosAdministrativos"
import TableResume from "../sections/tables/TableResume"
import GastosFinancieros from "../sections/tables/GastosFinancieros"
import { CaratulaPeriodoType } from "../caratula-periodo.type"
import { formatCurrencyToFixed } from "@/helpers/format-currency"

const GastosPage = ({
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
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View>
                <View style={{ paddingTop: "10" }} fixed />
                <Header firstDay={firstDay} lastDay={lastDay} logo_hotel={logo_hotel} numDays={numDays} />
                <GastosAdministrativos caratula={caratula} />
                <TableResume
                    title="Utilidad o pérdida antes de impuestos (EBITDA)"
                    value1={{ title: "Total", value: formatCurrencyToFixed(caratula.ebitda.total) }}
                    value2={{ title: "Promedio de habitación", value: caratula.ebitda.promedio_habitacion + "%" }}
                />
                <GastosFinancieros caratula={caratula} />
                <TableResume
                    title="Utilidad o pérdida neta"
                    value1={{ title: "Total", value: formatCurrencyToFixed(caratula.utilidad_perdida_neta.total) }}
                    value2={{ title: "Promedio de utilidad", value: caratula.utilidad_perdida_neta.porcentaje_utilidad + "%" }}
                />
            </View>
            <View style={{ paddingBottom: "30" }} fixed />
            <Footer nombre_hotel={nombre_hotel} page={1} totalPages={7} />
        </Page>
    )
}

export default GastosPage
