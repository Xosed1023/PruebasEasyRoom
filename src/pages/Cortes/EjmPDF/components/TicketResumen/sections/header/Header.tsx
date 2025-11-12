import { Image, Text, View } from "@react-pdf/renderer"
import React from "react"
import { formatDateShort } from "src/shared/hooks/formatDate-mm-dd-yy"
import logo from "../../../../img/logoHM.jpeg"

const Header = ({ turno, user, fechaCierreCorte }: { turno?: string; user?: string, fechaCierreCorte?: Date }) => {
    return (
        <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }} fixed>
            <Image src={logo} style={{ width: "80px" }} />
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                <View
                    style={{
                        marginLeft: "35px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Text style={{ fontWeight: 500, fontSize: 12 }}>Usuario</Text>
                    <Text style={{ color: "#5e6470", fontWeight: 500, marginTop: 3, fontSize: 12 }}>{user}</Text>
                </View>
                <View
                    style={{
                        marginLeft: "35px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Text style={{ fontWeight: 500, fontSize: 12 }}>Fecha</Text>
                    <Text style={{ color: "#5e6470", fontWeight: 500, fontSize: 12, marginTop: 3 }}>
                        {formatDateShort(fechaCierreCorte || new Date())}
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: "35px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}
                >
                    <Text style={{ fontWeight: 500, fontSize: 12 }}>Turno</Text>
                    <Text style={{ color: "#5e6470", fontWeight: 500, fontSize: 12, marginTop: 3 }}>{turno}</Text>
                </View>
            </View>
        </View>
    )
}

export default Header
