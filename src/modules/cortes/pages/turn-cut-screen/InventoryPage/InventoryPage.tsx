import { Text, View } from "@react-pdf/renderer"
import HeaderPDF from "../sections/header/HeaderPDF"
import { Corte } from "@/gql/schema"
import Cards from "./sections/Cards"
import { InventarioResponse } from "./InventoryPage.interface"
import Salidas from "./sections/Salidas"
import Footer from "../sections/footer/Footer"

const InventoryPage = ({
    corte,
    logo_hotel_url,
    inventario,
    nombre_hotel
}: {
    corte: Corte
    inventario?: InventarioResponse
    logo_hotel_url?: string
    nombre_hotel: string
}) => {
    return (
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
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Text style={{ fontWeight: 500, fontSize: 11 }}>Reporte de salidas de productos de inventario</Text>
                <Cards inventario={inventario} />
                <Salidas data={inventario?.articulos || []} />
            </View>
            
        </View>
            <Footer  page={1} totalPages={3} nombre_hotel={nombre_hotel} />
        </>
    )
}

export default InventoryPage
