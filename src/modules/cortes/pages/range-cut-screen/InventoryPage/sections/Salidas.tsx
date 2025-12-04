import { View } from "@react-pdf/renderer"
import { InventarioResponseArticulo } from "../InventoryPage.interface"
import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { formatCurrency } from "@/helpers/format-currency"

const Salidas = ({ data }: { data: InventarioResponseArticulo[] }) => {
    function capitalizeWords(text) {
        return text
            .toLowerCase()
            .split(" ")
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1)
            })
            .join(" ")
    }

    return (
        <View style={{ marginTop: "10px" }}>
            <Table  style={{ border: "0.5px solid #4A5468" }}>
                <Row backgroundColor="#f4f6f8">
                    <Cell width="64%" textStyle={{ fontSize: 10 }}>
                        Producto por categoría
                    </Cell>
                    <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 10, textAlign: "right" }}>
                        Cantidad vendida
                    </Cell>
                    <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 10, textAlign: "right" }}>
                        Total de venta
                    </Cell>
                </Row>
            </Table>
            {data.map((seccion) => (
                <Table style={{ borderTop: "none", border: "0.5px solid #4A5468" }} >
                    <Row backgroundColor="#d1d3de">
                        <Cell width="100%" textStyle={{ fontSize: 9, color: "#1A1C21", fontWeight: 500 }}>
                            {seccion.nombre}
                        </Cell>
                    </Row>
                    {seccion?.articulos.length ? (
                        seccion?.articulos?.map(({ articulo, cantidad, total }, index) => (
                            <Row backgroundColor={index % 2 === 0 ? "" : "#f4f6f8"} key={index}>
                                <Cell width="64%" textStyle={{ fontSize: 8 }}>
                                    {capitalizeWords(articulo)}
                                </Cell>
                                <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 9, textAlign: "right" }}>
                                    {cantidad}
                                </Cell>
                                <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 9, textAlign: "right" }}>
                                    {formatCurrency(Number(total))}
                                </Cell>
                            </Row>
                        ))
                    ) : (
                        <Row>
                            <Cell width="64%" textStyle={{ fontSize: 8 }}>
                                {"-"}
                            </Cell>
                            <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 9, textAlign: "right" }}>
                                {"0"}
                            </Cell>
                            <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 9, textAlign: "right" }}>
                                {formatCurrency(0)}
                            </Cell>
                        </Row>
                    )}
                </Table>
            ))}
        </View>
    )
}

export default Salidas
