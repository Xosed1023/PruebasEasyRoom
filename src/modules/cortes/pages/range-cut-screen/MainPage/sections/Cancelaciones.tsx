import { useEffect, useState } from "react"
import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { formatCurrency } from "@/helpers/format-currency"

const Cancelaciones = ({ cancelaciones }) => {
    const [totalCancelaciones, setTotalCancelaciones] = useState<number>(0)

    useEffect(() => {
        const total = cancelaciones?.reduce((acum, item) => (acum += Number(item.total) || 0), 0)
        setTotalCancelaciones(total)
    }, [cancelaciones])

    return (
        <Table style={{ marginTop: "10px", border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0" style={{ display: "flex", justifyContent: "space-between" }}>
                <Cell textStyle={{ fontSize: 8 }}>Cancelaciones</Cell>
                <Cell textStyle={{ fontSize: 8, textAlign: "right" }}>Total</Cell>
            </Row>
            {cancelaciones?.map((cancelacion, index) => (
                <Row
                    style={{ display: "flex", justifyContent: "space-between" }}
                    backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""}
                    key={index}
                >
                    <Cell textStyle={{ fontSize: 7 }}>{cancelacion.concepto}</Cell>
                    <Cell textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(cancelacion.total) || 0)}
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
                <Cell textStyle={{ fontWeight: 600, fontSize: 7 }}>Total</Cell>
                <Cell textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(totalCancelaciones || 0)}
                </Cell>
            </Row>
        </Table>
    )
}

export default Cancelaciones
