import { StyleSheet } from "@react-pdf/renderer"

export const styles = StyleSheet.create({
    page: {
        width: "100%",
        backgroundColor: "white",
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
    },
    date: {
        marginLeft: "35px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    cards_value: {
        color: "#5e6470",
        fontWeight: 600,
        fontSize: 10,
        marginTop: 3,
        width: "100%",
        backgroundColor: "#f4f6f8",
        paddingBottom: 5,
        paddingLeft: 5,
        paddingTop: 3,
    },
    table_cell: { fontWeight: 400, fontSize: 10, padding: 5, color: "#2b2c31" },
    cell_totales: { borderTop: "0.5px solid #b3b3b3"},
    cell_totales_habitaciones: {borderTop: "0.5px solid #b3b3b3", borderBottom: "0.5px solid #b3b3b3" },
    container_right: {
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    fixed: {
        top: 610,
        left: 0,
        width: "100%",
        position: "absolute",
    },
    fixedCorte: {
        top: 570,
        left: 0,
        width: "100%",
        position: "absolute",
    },
})
