import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { formatCurrency } from "@/helpers/format-currency"
import { styles } from "../../styles"


const Efectivo = ({ cortes_pdf }: {cortes_pdf: any }) => {
    return (
        <Table style={{ marginTop: "10px", border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0">
                <Cell width="40%" textStyle={{ fontSize: 8 }}>
                    Manejo de efectivo
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    #
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    Monto
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    Total
                </Cell>
            </Row>
            {cortes_pdf?.fajillas?.map((faj, index) => (
                <Row backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""} key={index}>
                    <Cell width="40%" textStyle={{ fontSize: 7 }}>
                        Fajillas
                    </Cell>
                    <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {faj.cantidad}
                    </Cell>
                    <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {formatCurrency(Number(faj.monto || 0) || 0)}
                    </Cell>
                    <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {formatCurrency(Number(faj.total || 0) || 0)}
                    </Cell>
                </Row>
            ))}
            <Row backgroundColor={cortes_pdf?.fajillas?.length % 2 !== 0 ? "#f2f4f7" : ""}>
                <Cell width="75%" textStyle={{ fontSize: 7 }}>
                    Efectivo en caja
                </Cell>
                <Cell width="25%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_pdf?.efectivo_caja || 0) || 0)}
                </Cell>
            </Row>
            <Row style={styles.cell_totales}>
                <Cell width="75%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Total
                </Cell>
                <Cell width="25%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(cortes_pdf?.total_manejo_efectivo || 0) || 0)}
                </Cell>
            </Row>
        </Table>
    )
}

export default Efectivo
