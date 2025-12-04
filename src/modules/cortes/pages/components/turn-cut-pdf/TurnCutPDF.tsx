import { Document, Page } from "@react-pdf/renderer"
import MainPage from "../../turn-cut-screen/MainPage/MainPage"
import InventoryPage from "../../turn-cut-screen/InventoryPage/InventoryPage"
import PropinasPage from "../../turn-cut-screen/PropinasPage/PropinasPage"
import { Corte, Hotel } from "@/gql/schema"
import { ICortes } from "../../interfaces/cortes-pdf"
import { styles } from "../../turn-cut-screen/styles"
import { InventarioResponse } from "../../turn-cut-screen/InventoryPage/InventoryPage.interface"

const TurnCutPDF = ({
    corte,
    cortes_pdf,
    hotelSelected,
    inventario,
    reportePropinas,
}: {
    corte: Corte
    cortes_pdf: ICortes
    hotelSelected: Hotel
    inventario?: InventarioResponse
    reportePropinas: any
}) => {
    return (
        <Document title="Corte">
            <Page size="LETTER" style={styles.page}>
                <MainPage
                    corte={corte}
                    logo_hotel_url={hotelSelected?.logo_hotel || ""}
                    cortes_pdf={cortes_pdf}
                    nombre_hotel={hotelSelected?.nombre_hotel || ""}
                />
            </Page>
            <Page size="LETTER" style={{ ...styles.page, paddingBottom: "30px" }}>
                <InventoryPage
                    inventario={inventario}
                    corte={corte}
                    logo_hotel_url={hotelSelected?.logo_hotel || ""}
                    nombre_hotel={hotelSelected?.nombre_hotel || ""}
                />
            </Page>
            <Page size="A4" orientation="landscape" style={{ ...styles.page }}>
                <PropinasPage {...reportePropinas} corte={corte as Corte} />
            </Page>
        </Document>
    )
}

export default TurnCutPDF
