import { Text, View } from "@react-pdf/renderer"

const Footer = ({ page, totalPages, nombre_hotel = "" }) => {
    console.log(page, totalPages)
    return (
        <>
            <View
                style={{
                    height: 40,
                    width: "100%",
                }}
                fixed
            />
            <View
                style={{
                    borderTop: "1px solid #e1e3e8",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: "30",
                    position: "absolute",
                    bottom: 0, // Para que siempre esté al final de la página
                    left: 0,
                    right: 0,
                    margin: "10px 20px",
                }}
                fixed
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Text
                        style={{
                            color: "#6e747e",
                            fontSize: 10,
                            marginTop: 4,
                            paddingRight: 5,
                        }}
                    >
                        {nombre_hotel}
                    </Text>
                </View>
                <Text
                    style={{
                        color: "#6e747e",
                        fontSize: 10,
                        marginTop: 4,
                        paddingLeft: 5,
                        borderLeft: "1px solid #e1e3e8",
                    }}
                >
                    easyroom.io
                </Text>
            </View>
        </>
    )
}

export default Footer
