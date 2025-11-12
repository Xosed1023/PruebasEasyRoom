import { Document, Page, PDFViewer, View, Image, Text } from "@react-pdf/renderer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { styles } from "./styled"
import { useProfile } from "src/shared/hooks/useProfile"
import { PropinasPDFProps } from "./index.type"

interface PropinasDocPDFProps extends PropinasPDFProps {
    loading: boolean
    headers: string[]
    widths: number[]
    title: string
    centerSeparator?: boolean
}

function PropinasPDF({
    data = [],
    totals = [],
    dates = [],
    loading,
    headers = [],
    widths = [],
    title = "",
    centerSeparator = true,
}: PropinasDocPDFProps): JSX.Element {
    const { logo_hotel, nombre_hotel } = useProfile()

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {!loading && (
                <PDFViewer style={{ width: "100%", height: "calc(100vh - 40px)" }}>
                    <Document title={title}>
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
                            <Text style={styles.title}>{title}</Text>
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
                                                    alignItems: centerSeparator ? "center" : "flex-start",
                                                    paddingLeft: centerSeparator ? 0 : 12,
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
                                                <Text style={{ ...styles.table_row_label, fontWeight: 700 }}>
                                                    {value}
                                                </Text>
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
                    </Document>
                </PDFViewer>
            )}
            <LoaderComponent visible={loading} />
        </div>
    )
}

export default PropinasPDF
