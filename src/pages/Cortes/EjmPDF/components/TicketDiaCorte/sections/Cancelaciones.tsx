import { formatCurrency } from "src/shared/hooks/formatCurrency"
import Table from "../../PDFTable/Table/Table"
import Row from "../../PDFTable/Row/Row"
import Cell from "../../PDFTable/Cell/Cell"
import { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"

const Cancelaciones = ({ cancelaciones }) => {
    const [totales, setTotales] = useState({ total: 0, cantidad: 0 })

    useEffect(() => {
        const nuevosTotales = cancelaciones?.reduce(
            (acum, item) => {
                acum.total += Number(item.total || 0)
                acum.cantidad += Number(item.cantidad || 0)
                return acum
            },
            { total: 0, cantidad: 0 }
        ) || { total: 0, cantidad: 0 }

        setTotales(nuevosTotales)
    }, [cancelaciones])

    return (
        <Table style={{ marginTop: "10px", border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0" style={{ display: "flex", justifyContent: "space-between" }}>
                <Cell width="64%" textStyle={{ fontSize: 8 }}>
                    Cancelaciones
                </Cell>
                <Cell width="18%" textStyle={{ fontSize: 8, textAlign: "right" }}>
                    #
                </Cell>
                <Cell width="18%" textStyle={{ fontSize: 8, textAlign: "right" }}>
                    Total
                </Cell>
            </Row>
            {cancelaciones?.map((cancelacion, index) => (
                <Row
                    style={{ display: "flex", justifyContent: "space-between" }}
                    backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""}
                    key={uuid()}
                >
                    <Cell width="64%" textStyle={{ fontSize: 7 }}>
                        {cancelacion.concepto}
                    </Cell>
                    <Cell width="18%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {cancelacion.cantidad}
                    </Cell>
                    <Cell width="18%" textStyle={{ fontSize: 7, textAlign: "right" }}>
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
                {/* <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {totales.cantidad || 0}
                </Cell> */}
                <Cell textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(totales.total || 0)}
                </Cell>
            </Row>
        </Table>
    )
}

export default Cancelaciones