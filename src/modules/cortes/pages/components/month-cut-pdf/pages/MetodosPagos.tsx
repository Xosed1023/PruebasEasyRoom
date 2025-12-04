import { Page, View } from "@react-pdf/renderer"
import { styles } from "../TicketCaratulaStyles"
import Footer from "../sections/footer/Footer"
import Header from "../sections/header/Header"
import IngresosMetodoPago from "../sections/tables/IngresosMetodoPago"
import EgresosMetodoPago from "../sections/tables/EgresosMetodoPago"
import { CaratulaPeriodoType } from "../caratula-periodo.type"

const MetodosPagos = ({
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
                <Header
                    firstDay={firstDay}
                    lastDay={lastDay}
                    logo_hotel={logo_hotel}
                    numDays={numDays}
                />
                <IngresosMetodoPago caratula={caratula} />
                <EgresosMetodoPago caratula={caratula} />
            </View>
            <View style={{ paddingBottom: "30" }} fixed />
            <Footer nombre_hotel={nombre_hotel} page={1} totalPages={7} />
        </Page>
    )
}

export default MetodosPagos
