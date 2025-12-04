import { Page, View } from "@react-pdf/renderer"
import { styles } from "../TicketCaratulaStyles"
import PageCards from "../sections/cards/PageCards"
import PageCard from "../sections/cards/PageCard"
import RestauranteCaratula from "../sections/tables/RestauranteCaratula"
import RoomServiceCaratula from "../sections/tables/RoomService"
import Footer from "../sections/footer/Footer"
import IngresosTable from "../sections/tables/Ingresos"
import Header from "../sections/header/Header"
import { CaratulaPeriodoType } from "../caratula-periodo.type"

const Ingresos = ({
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
                <PageCards>
                    <PageCard title="Habitaciones en unidad" value={caratula?.encabezados.habitaciones_unidad || ""} />
                    <PageCard
                        title="Promedio diario de ocupación"
                        value={caratula?.encabezados?.promedio_diario_ocupacion.toFixed(2)}
                    />
                    <PageCard
                        title="Porcentaje de ocupación"
                        value={`${caratula?.encabezados?.porcentaje_ocupacion.toFixed(2)}%`}
                    />
                    <PageCard
                        title="Total de habitaciones vendidas"
                        value={caratula?.encabezados?.total_habitaciones_vendidas}
                    />
                </PageCards>
                <IngresosTable caratula={caratula} />
                <RoomServiceCaratula caratula={caratula} />
                {!!caratula.ingresos_restaurante.detalles.length && <RestauranteCaratula caratula={caratula} />}
            </View>
            <View style={{ paddingBottom: "30" }} fixed />
            <Footer nombre_hotel={nombre_hotel} page={1} totalPages={7} />
        </Page>
    )
}

export default Ingresos
