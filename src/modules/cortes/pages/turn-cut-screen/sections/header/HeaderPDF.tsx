import { Image, Text, View } from "@react-pdf/renderer"
import { getFechaCorte } from "@/modules/cortes/helpers/formatFullDate"
import { styles } from "../../styles"
import { Corte } from "@/gql/schema"

const HeaderPDF = ({
    logo_hotel_url,
    userName,
    fecha_fin_corte,
    turnoName,
    corte
}: {
    logo_hotel_url?: string
    userName: string
    corte?: Corte
    fecha_fin_corte: string
    turnoName: string
}) => {
    return (
        <View
            style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                marginBottom: 10,
            }}
            fixed
        >
            <Image
                src={logo_hotel_url || "src/assets/png/logo_md.png"}
                style={{
                    height: "50px",
                    backgroundColor: logo_hotel_url ? "#0e0e0e" : "",
                }}
            />
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 9 }}>Usuario</Text>
                    <Text
                        style={{
                            color: "#5e6470",
                            fontWeight: 500,
                            fontSize: 9,
                            marginTop: 3,
                        }}
                    >
                        {userName}
                    </Text>
                </View>
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                    <Text
                        style={{
                            color: "#5e6470",
                            fontWeight: 500,
                            fontSize: 9,
                            marginTop: 3,
                        }}
                    >
                        {fecha_fin_corte ? getFechaCorte(fecha_fin_corte) : ""}
                    </Text>
                </View>
                {corte?.folio && (
                    <View style={styles.date}>
                        <Text style={{ fontWeight: 500, fontSize: 9 }}>Folio</Text>
                        <Text
                            style={{
                                color: "#5e6470",
                                fontWeight: 500,
                                fontSize: 9,
                                marginTop: 3,
                            }}
                        >
                            {corte?.folio || ""}
                        </Text>
                    </View>
                )}
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 9 }}>Turno</Text>
                    <Text
                        style={{
                            color: "#5e6470",
                            fontWeight: 500,
                            fontSize: 9,
                            marginTop: 3,
                        }}
                    >
                        {turnoName}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default HeaderPDF
