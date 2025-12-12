import { Page, View, Image, Text, PDFViewer, Document } from "@react-pdf/renderer"
import { styles } from "../styled"
import { useReportePropinasData } from "./data"
import { PropinasPDFProps } from "../index.type"

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
}

function ReportePropinasPage({ data, totals, logo_hotel, nombre_hotel, dates }: PropinasPDFPageProps): JSX.Element {
    return (
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <Image
                    src={logo_hotel || require("src/assets/png/logo_md.png")}
                    style={{ height: "50px", backgroundColor: logo_hotel ? "#0e0e0e" : "" }}
                />
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                    {dates.map(({ label = "", value = "" }, i) => (
                        <View style={styles.date} key={i}>
                            <Text style={styles.date_label}>{label}</Text>
                            <Text
                                style={{
                                    ...styles.date_label,
                                    color: "#5e6470",
                                    marginTop: 3,
                                }}
                            >
                                {value}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
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
            <View style={styles.footer}>
                <Text style={{ ...styles.footer_label, marginRight: 15 }}>{nombre_hotel}</Text>
                <Text style={styles.footer_label}>{"easyroom.io"}</Text>
            </View>
        </Page>
    )
}

function Demo(): JSX.Element {
    const obj = useReportePropinasData({
        corte_id: "44a03b18-4cf7-4584-80fb-73db0530dfc3",
    })

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <PDFViewer style={{ width: "100%", height: "calc(100vh - 40px)" }}>
                <Document title={"Reporte de propinas del turno"}>
                    <ReportePropinasPage {...obj} />
                </Document>
            </PDFViewer>
        </div>
    )
}

export { ReportePropinasPage, useReportePropinasData }

export default Demo
