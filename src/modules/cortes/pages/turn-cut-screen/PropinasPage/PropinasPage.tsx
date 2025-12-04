import { View, Text } from "@react-pdf/renderer"
import { PropinasPDFProps } from "./PropinasPage.type"
import { styles } from "./PropinasPage.styles"
import { ReactNode } from "react"
import { Corte } from "@/gql/schema"
import HeaderPDF from "../sections/header/HeaderPDF"
import Footer from "../sections/footer/Footer"

export const headers = [
    "Personal",
    "Estancia",
    "Alimentos",
    "Bebidas",
    "Sex&Spa",
    "Otros",
    "Propinas\npor venta",
    "Puntos\na pagar",
    "Comisión\nTarjeta",
    "Total",
    "Firma de colaborador",
]

export const widths = [90, 35, 40, 30, 35, 20, 38, 30, 40, 35, 80]

interface PropinasPDFPageProps extends PropinasPDFProps {
    logo_hotel: string
    nombre_hotel: string
    corte?: Corte
}

function PropinasPage({ data, totals, logo_hotel, nombre_hotel, corte }: PropinasPDFPageProps): ReactNode {
    return (
        <>
            <HeaderPDF
                corte={corte}
                fecha_fin_corte={corte?.fecha_fin_corte || ""}
                logo_hotel_url={logo_hotel || undefined}
                turnoName={corte?.turno?.nombre || ""}
                userName={`${corte?.usuario_crea?.nombre} ${corte?.usuario_crea?.apellido_paterno} ${corte?.usuario_crea?.apellido_materno}`}
            />
            <Text style={styles.title}>{"Reporte de propinas del turno"}</Text>
            <View style={styles.table}>
                <View style={styles.table_header}>
                    {headers.map((header, i) => (
                        <View
                            style={{
                                ...styles.table_item,
                                width: widths?.[i] + 30,
                            }}
                            key={i}
                        >
                            <Text style={styles.table_header_item_label}>{header}</Text>
                        </View>
                    ))}
                </View>
                <View>
                    {data.map(({ section = "", values = [] }, i) => (
                        <View key={i}>
                            <View
                                style={{
                                    ...styles.table_separator,
                                    alignItems: "flex-start",
                                    paddingLeft: 12,
                                }}
                            >
                                <Text style={styles.table_separator_label}>{section}</Text>
                            </View>
                            {values.map(({ value }, v) => (
                                <View
                                    key={v}
                                    style={{
                                        ...styles.table_row,
                                        backgroundColor: Number(v + 1) % 2 ? "#FFF" : "#EFEFEF",
                                    }}
                                >
                                    {value.map((item, key) => (
                                        <View
                                            key={key}
                                            style={{
                                                ...styles.table_item,
                                                width: widths?.[key] + 30,
                                            }}
                                        >
                                            <Text style={styles.table_row_label}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))}
                    <View
                        style={{
                            ...styles.table_row,
                            backgroundColor: "#EFEFEF",
                        }}
                    >
                        {totals.map((value, i) => (
                            <View
                                key={i}
                                style={{
                                    ...styles.table_item,
                                    width: widths?.[i] + 30,
                                }}
                            >
                                <Text style={{ ...styles.table_row_label, fontWeight: 700 }}>{value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <Footer page={3} totalPages={3} nombre_hotel={nombre_hotel} />
        </>
    )
}

export default PropinasPage
