import { Document, Page } from "@react-pdf/renderer"
import { Hotel } from "@/gql/schema"
import { ICortes } from "../../interfaces/cortes-pdf"
import { styles } from "../../turn-cut-screen/styles"
import { InventarioResponse } from "../../turn-cut-screen/InventoryPage/InventoryPage.interface"
import MainPage from "../../day-cut-screen/MainPage/MainPage"
import InventoryPage from "../../day-cut-screen/InventoryPage/InventoryPage"

const DayCutPDF = ({
    cortes_pdf,
    hotelSelected,
    inventario,
    folios,
    dates,
}: {
    dates: Date[]
    cortes_pdf: ICortes
    folios: string[]
    hotelSelected: Hotel
    inventario?: InventarioResponse
}) => {
    return (
        <Document title="Corte">
            <Page size="LETTER" style={styles.page}>
                <MainPage
                    dates={dates}
                    folios={folios}
                    logo_hotel_url={hotelSelected?.logo_hotel || ""}
                    cortes_pdf={cortes_pdf}
                    nombre_hotel={hotelSelected?.nombre_hotel || ""}
                />
            </Page>
            <Page size="LETTER" style={{ ...styles.page, paddingBottom: "30px" }}>
                <InventoryPage
                    dates={dates}
                    folios={folios}
                    inventario={inventario}
                    logo_hotel_url={hotelSelected?.logo_hotel || ""}
                    nombre_hotel={hotelSelected?.nombre_hotel || ""}
                />
            </Page>
        </Document>
    )
}

export default DayCutPDF
