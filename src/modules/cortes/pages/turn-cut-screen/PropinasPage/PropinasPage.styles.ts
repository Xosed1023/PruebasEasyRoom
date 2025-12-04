import { StyleSheet, Font } from "@react-pdf/renderer"
import robotoRegular from "src/assets/fonts/Roboto/Roboto-Regular.ttf"
import robotoMedium from "src/assets/fonts/Roboto/Roboto-Medium.ttf"
import robotoBold from "src/assets/fonts/Roboto/Roboto-Bold.ttf"

Font.register({
    family: "Roboto",
    fonts: [
        { src: robotoRegular, fontWeight: 400 },
        { src: robotoMedium, fontWeight: 500 },
        { src: robotoBold, fontWeight: 700 },
    ],
})

export const styles = StyleSheet.create({
    page: {
        width: "100%",
        backgroundColor: "white",
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
    },
    date: {
        marginLeft: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    date_label: {
        fontSize: 10,
        fontWeight: 500,
        fontFamily: "Roboto",
    },
    title: {
        fontSize: 14,
        fontWeight: 700,
        color: "#303030",
        marginBottom: 10,
        fontFamily: "Roboto",
    },
    table: {
        border: "1px solid #BEBEBE",
    },
    table_header: {
        height: 34,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        paddingTop: 4,
        backgroundColor: "#BEBEBE",
    },
    table_header_item_label: {
        fontSize: 8,
        fontWeight: 500,
        letterSpacing: 0.08,
        fontFamily: "Roboto",
    },
    table_item: {
        padding: "0 15px",
        overflow: "hidden",
    },
    table_separator: {
        width: "100%",
        height: 15,
        backgroundColor: "#BEBEBE",
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid #667085",
        borderTop: "1px solid #667085",
    },
    table_separator_label: {
        color: "#303030",
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 0.08,
        fontFamily: "Roboto",
    },
    table_row: {
        width: "100%",
        height: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    table_row_label: {
        fontSize: 7,
        fontWeight: 400,
        letterSpacing: 0.07,
        color: "#303030",
        fontFamily: "Roboto",
    },
    footer: {
        borderTop: "1px solid #BEBEBE",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        padding: "6px 0 8px",
        position: "absolute",
        bottom: 0,
        left: 20,
    },
    footer_label: {
        fontSize: 10,
        color: "#303030",
        fontWeight: 400,
        fontFamily: "Roboto",
    },
})
