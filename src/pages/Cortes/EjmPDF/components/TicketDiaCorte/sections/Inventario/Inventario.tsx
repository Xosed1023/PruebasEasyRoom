import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { v4 as uuid } from "uuid"
import { View } from "@react-pdf/renderer"
import { Articulos } from "./interfaces/articulos.interface"

const Inventario = ({ data }: {data: Articulos[]} ) => {
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
            <Table style={{ border: "1px solid #e3e3e3" }}>
                <Row backgroundColor="#f4f6f8">
                    <Cell width="80%" textStyle={{ fontSize: 10 }}>
                        Productos por categoría
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 10, textAlign: "right" }}>
                        En inventario
                    </Cell>
                </Row>
            </Table>
            {data.map((seccion, index) => (
                <View wrap={index === 0 ? true : false} key={uuid()}>
                    <Table style={{ border: "1px solid #e3e3e3" }} >
                        <Row>
                            <Cell width="100%" textStyle={{ fontSize: 9 }}>
                                {seccion.categoria}
                            </Cell>
                        </Row>
                        {seccion?.articulos?.map((articulo, index) => (
                            <Row backgroundColor={index % 2 === 0 ? "#f4f6f8" : ""} key={uuid()}>
                                <Cell width="80%" textStyle={{ fontSize: 8 }}>
                                    {capitalizeWords(articulo.nombre)}
                                </Cell>
                                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 9, textAlign: "right" }}>
                                    {`${articulo.stock}`}
                                </Cell>
                            </Row>
                        ))}
                    </Table>
                </View>
            ))}
        </View>
    )
}

export default Inventario
