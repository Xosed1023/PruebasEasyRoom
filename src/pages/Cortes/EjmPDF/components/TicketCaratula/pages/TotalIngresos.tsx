import { Page, View } from "@react-pdf/renderer"
import { styles } from "../TicketCaratulaStyles"
import { CaratulaPeriodoType } from "../../../sections/caratula-periodo.type"
import PageCards from "../sections/cards/PageCards"
import PageCard from "../sections/cards/PageCard"
import TotalIngresos from "../sections/tables/TotalIngesos"
import GastosCategoriasCaratula from "../sections/tables/GastosCategorias"
import Footer from "../sections/footer/Footer"
import Header from "../sections/header/Header"
import TableResume from "../sections/tables/TableResume"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"

const TotalIngresosPage = ({
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
                <TotalIngresos caratula={caratula} />
                <GastosCategoriasCaratula caratula={caratula} />
                <TableResume
                    title="Utilidad o pérdida directa de operación (GOP)"
                    value1={{ title: "Total", value: formatCurrencyToFixed(caratula.utilidad_gop.total) }}
                    value2={{ title: "Porcentaje de utilidad", value: caratula.utilidad_gop.porcentaje_utilidad + "%" }}
                />
            </View>
            <View style={{ paddingBottom: "30" }} fixed />
            <Footer nombre_hotel={nombre_hotel} page={1} totalPages={7} />
        </Page>
    )
}

export default TotalIngresosPage
