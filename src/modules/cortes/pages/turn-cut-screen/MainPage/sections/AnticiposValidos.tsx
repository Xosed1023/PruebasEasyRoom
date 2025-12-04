import { styles } from "../../styles"
import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { formatCurrency } from "@/helpers/format-currency"

const AnticiposValidos = ({ cortes_pdf }: {cortes_pdf: any}) => {
    return (
        <Table style={{ marginTop: "5px", border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0">
                <Cell width="60%" textStyle={{ fontSize: 8 }}>
                    Anticipos válidos
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    #
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    Total
                </Cell>
            </Row>
            <Row>
                <Cell width="60%" textStyle={{ fontSize: 7 }}>
                    Reservas de habitaciones
                </Cell>

                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {cortes_pdf?.informacion_anticipos_validos?.habitaciones?.cantidad || 0}
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_pdf?.informacion_anticipos_validos?.habitaciones?.total || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="60%" textStyle={{ fontSize: 7 }}>
                    Paquetes y T. dinámicas
                </Cell>

                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {cortes_pdf?.informacion_anticipos_validos?.experiencias?.cantidad || 0}
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_pdf?.informacion_anticipos_validos?.experiencias?.total || 0) || 0)}
                </Cell>
            </Row>
            <Row backgroundColor="#f2f4f7">
                <Cell width="60%" textStyle={{ fontSize: 7 }}>
                    Extras
                </Cell>

                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {cortes_pdf?.informacion_anticipos_validos?.extras?.cantidad || 0}
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_pdf?.informacion_anticipos_validos?.extras?.total || 0) || 0)}
                </Cell>
            </Row>
            <Row style={styles.cell_totales}>
                <Cell width="60%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {cortes_pdf?.informacion_anticipos_validos?.totales?.cantidad || 0}
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(cortes_pdf?.informacion_anticipos_validos?.totales?.total || 0))}
                </Cell>
            </Row>
        </Table>
    )
}

export default AnticiposValidos
