import { Image, Text, View } from "@react-pdf/renderer"
import { styles } from "../../TicketCaratulaStyles"

const Header = ({
    firstDay,
    lastDay,
    numDays,
    logo_hotel = "",
}: {
    firstDay: string
    lastDay: string
    numDays: number
    logo_hotel: string
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
                src={logo_hotel || require("src/assets/png/logo_md.png")}
                style={{ height: "50px", backgroundColor: logo_hotel ? "#0e0e0e" : "" }}
            />
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 10 }}>Fecha inicio</Text>
                    <Text style={{ color: "#5e6470", fontWeight: 500, marginTop: 3, fontSize: 10 }}>{firstDay}</Text>
                </View>
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 10 }}>Fecha término</Text>
                    <Text style={{ color: "#5e6470", fontWeight: 500, fontSize: 10, marginTop: 3 }}>{lastDay}</Text>
                </View>
                <View style={styles.date}>
                    <Text style={{ fontWeight: 500, fontSize: 10 }}>Días</Text>
                    <Text style={{ color: "#5e6470", fontWeight: 500, fontSize: 10, marginTop: 3 }}>{numDays}</Text>
                </View>
            </View>
        </View>
    )
}

export default Header
