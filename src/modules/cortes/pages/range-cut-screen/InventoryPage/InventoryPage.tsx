import { Text, View } from "@react-pdf/renderer"
import HeaderPDF from "../sections/header/HeaderPDF"
import Cards from "./sections/Cards"
import { InventarioResponse } from "./InventoryPage.interface"
import Salidas from "./sections/Salidas"
import Footer from "../sections/footer/Footer"

const InventoryPage = ({
    logo_hotel_url,
    dates,
    inventario,
    nombre_hotel,
    folios,
}: {
    inventario?: InventarioResponse
    dates: Date[]
    logo_hotel_url?: string
    nombre_hotel: string
    folios: string[]
}) => {
    return (
        <>
            <View>
                <HeaderPDF dates={dates} folios={folios} logo_hotel_url={logo_hotel_url || undefined} />
                <View
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ fontWeight: 500, fontSize: 11 }}>Reporte de salidas de productos de inventario</Text>
                    <Cards inventario={inventario} />
                    <Salidas data={inventario?.articulos || []} />
                </View>
            </View>
            <Footer page={1} totalPages={3} nombre_hotel={nombre_hotel} />
        </>
    )
}

export default InventoryPage
