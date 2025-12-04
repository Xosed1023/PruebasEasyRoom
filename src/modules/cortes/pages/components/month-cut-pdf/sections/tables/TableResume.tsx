import { Text, View } from "@react-pdf/renderer"
import PageCard from "../cards/PageCard";

const TableResume = ({
    title,
    value1,
    value2,
}: {
    title: string | number
    value1: { title: string | number; value: string | number }
    value2: { title: string | number; value: string | number }
}) => {
    return (
        <View
            style={{
                width: "100%",
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                marginTop: "20px",
                justifyContent: "flex-end",
            }}
        >
            <Text style={{ fontWeight: 500, fontSize: 10 }}>{title}</Text>
            <PageCard title={value1.title + ""} value={value1.value + ""} />
            <PageCard title={value2.title + ""} value={value2.value + ""} />
        </View>
    )
}

export default TableResume
