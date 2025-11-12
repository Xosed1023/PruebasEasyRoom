import { Text, View } from "@react-pdf/renderer"
import React from "react"

const Footer = ({nombre_hotel = ""}) => {
    return (
        <View
            fixed
            style={{
                borderTop: "1px solid #e1e3e8",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
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
                        width: "90%",
                        textAlign: "left",
                        borderRight: "1px solid #e1e3e8",
                    }}
                >
                    {nombre_hotel}
                </Text>
                <Text
                    style={{
                        color: "#6e747e",
                        fontSize: 10,
                        marginTop: 4,
                        paddingLeft: 5,
                    }}
                >
                    easyroom.io
                </Text>
            </View>
        </View>
    )
}

export default Footer
