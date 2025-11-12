import { Text, View } from "@react-pdf/renderer"
import { styles } from "../../TicketCaratulaStyles"

const PageCard = ({ title, value }: { title: string; value?: string | number }) => {
    return (
        <View style={{ border: "1px solid #e3e3e3", width: "23%" }}>
            <Text style={{ fontWeight: 500, fontSize: 9, paddingTop: 5, paddingLeft: 5 }}>{title}</Text>
            <Text style={styles.cards_value}>{value}</Text>
        </View>
    )
}

export default PageCard
