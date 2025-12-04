import { formatCurrency } from "@/helpers/format-currency"
import Cell from "../../../components/PDFTable/Cell/Cell"
import Row from "../../../components/PDFTable/Row/Row"
import Table from "../../../components/PDFTable/Table/Table"

const Descuentos = ({ descuentos, egresos }) => {
    return (
        <Table style={{ marginTop: "10px", border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0">
                <Cell width="25%" textStyle={{ fontSize: 8 }}>
                    Descuentos
                </Cell>
                <Cell width="20%" textStyle={{ fontSize: 8, textAlign: "right" }}>
                    Cortesías
                </Cell>
                <Cell width="30%" textStyle={{ fontSize: 8, textAlign: "right" }}>
                    Consumo interno
                </Cell>
                <Cell width="25%" textStyle={{ fontSize: 8, textAlign: "right" }}>
                    Love Points
                </Cell>
            </Row>
            {descuentos?.map((descuento, index) => (
                <Row key={index} backgroundColor={index % 2 === 0 ? "" : "#f2f4f7"}>
                    <Cell width="25%" textStyle={{ fontSize: 7 }}>
                        {descuento.concepto}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(descuento?.cortesias || 0) || 0)}
                    </Cell>
                    <Cell width="30%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(descuento?.consumo_interno || 0) || 0)}
                    </Cell>
                    <Cell width="25%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(descuento?.love_points || 0) || 0)}
                    </Cell>
                </Row>
            ))}
            <Row
                style={{
                    borderTop: "1px solid #e3e3e3",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Cell width="25%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(egresos?.cortesias || 0) || 0)}
                </Cell>
                <Cell width="30%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(egresos?.consumo_interno || 0) || 0)}
                </Cell>
                <Cell width="25%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(egresos?.love_points || 0) || 0)}
                </Cell>
            </Row>
        </Table>
    )
}

export default Descuentos
