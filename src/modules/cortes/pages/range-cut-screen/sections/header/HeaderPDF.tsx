import { Image, Text, View } from "@react-pdf/renderer"
import { styles } from "../../styles"
import formatDateDDMMMYYYY from "@/helpers/formatDateDDMMMYYYY"

const HeaderPDF = ({
    logo_hotel_url,
    dates,
    folios
}: {
    logo_hotel_url?: string
    dates: Date[]
    folios: string[]
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
                    <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                    <Text
                        style={{
                            color: "#5e6470",
                            fontWeight: 500,
                            fontSize: 9,
                            marginTop: 3,
                        }}
                    >
                        {formatDateDDMMMYYYY({date: dates[0]})}
                    </Text>
                </View>
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 9 }}>Folios</Text>
                    <Text
                        style={{
                            color: "#5e6470",
                            fontWeight: 500,
                            fontSize: 9,
                            marginTop: 3,
                        }}
                    >
                        {folios.join(",")}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default HeaderPDF
