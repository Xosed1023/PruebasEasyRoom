import { Text, View } from "@react-pdf/renderer"
import Tarifas from "./sections/Tarifas"
import { ICortes } from "../../interfaces/cortes-pdf"
import AnticiposValidos from "./sections/AnticiposValidos"
import RoomService from "./sections/RoomService"
import Restaurante from "./sections/Restaurante"
import { Corte } from "@/gql/schema"
import HeaderPDF from "../sections/header/HeaderPDF"
import Gastos from "./sections/Gastos"
import Efectivo from "./sections/Efectivo"
import Cancelaciones from "./sections/Cancelaciones"
import Descuentos from "./sections/Descuentos"
import Totales from "./sections/Totales"
import { styles } from "../styles"
import Ingresos from "./sections/Ingresos"
import Footer from "../sections/footer/Footer"

const MainPage = ({
    cortes_pdf,
    corte,
    logo_hotel_url,
    nombre_hotel,
}: {
    cortes_pdf: ICortes
    corte: Corte
    logo_hotel_url?: string
    nombre_hotel: string
}) => {
    return (
        cortes_pdf && (
            <>
                <View>
                    <HeaderPDF
                        corte={corte}
                        fecha_fin_corte={corte?.fecha_fin_corte || ""}
                        logo_hotel_url={logo_hotel_url || undefined}
                        turnoName={corte?.turno?.nombre || ""}
                        userName={`${corte?.usuario_crea?.nombre} ${corte?.usuario_crea?.apellido_paterno} ${corte?.usuario_crea?.apellido_materno}`}
                    />
                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ width: "49%" }}>
                            <Tarifas cortes_pdf={cortes_pdf.cortes_pdf} ticket_promedio={cortes_pdf.tickets_promedio} />
                            <RoomService cortes_pdf={cortes_pdf.cortes_pdf} ticket_promedio={cortes_pdf.tickets_promedio} />
                            <Restaurante cortes_pdf={cortes_pdf.cortes_pdf} ticket_promedio={cortes_pdf.tickets_promedio} />
                            <Ingresos cortes_pdf={cortes_pdf} />
                            <View style={styles.fixedCorte}>
                                <Text style={{ fontWeight: 700, fontSize: 8, marginTop: 20 }}>Informativo</Text>
                                <AnticiposValidos cortes_pdf={cortes_pdf} />
                                {/* <Incidencias cortes_pdf={cortes_pdf?.cortes_pdf} corte={corte} />*/}
                            </View>
                        </View>
                        <View style={{ width: "49%" }}>
                            <Gastos
                                cortes_pdf={cortes_pdf.cortes_pdf}
                                fajillas={cortes_pdf.manejo_efectivo?.fajillas}
                            />
                            <Efectivo cortes_pdf={cortes_pdf.cortes_pdf} />
                            <Cancelaciones cancelaciones={cortes_pdf.cortes_pdf.cancelaciones_conceptos} />
                            <Descuentos descuentos={cortes_pdf.cortes_pdf.descuentos} egresos={cortes_pdf.egresos} />
                            <Totales
                                resultado_corte={cortes_pdf?.resultado_corte}
                                corte={corte}
                                totales={cortes_pdf?.total_corte}
                                anticipo={cortes_pdf?.resultado_corte?.anticipos_validos}
                                manejo_efectivo={cortes_pdf?.manejo_efectivo}
                            />
                        </View>
                    </View>
                </View>
                <Footer page={1} totalPages={3} nombre_hotel={nombre_hotel} />
            </>
        )
    )
}

export default MainPage
