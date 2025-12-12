import { formatCurrency } from "src/shared/hooks/formatCurrency"
import Table from "../../PDFTable/Table/Table"
import Row from "../../PDFTable/Row/Row"
import Cell from "../../PDFTable/Cell/Cell"
import { styles } from "../../TicketCaratula/TicketCaratulaStyles"
import { ResumenPropinas } from "../../../sections/interfaces/cortes-pdf"

interface Props {
    resumen_propinas?: ResumenPropinas
}

const Propinas = ({ resumen_propinas }: Props) => {
    const porcentaje = resumen_propinas?.porcentaje_comision_por_puntos
    return (
        <Table style={{ marginTop: "10px", border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0">
                <Cell width="80%" textStyle={{ fontSize: 8 }}>
                    Propinas
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    Total
                </Cell>
            </Row>
            <Row>
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Utilidad sobre propinas {porcentaje ? `(${porcentaje}%)` : ""}
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(resumen_propinas?.utilidad_propinas || 0) || 0)}
                </Cell>
            </Row>
            <Row backgroundColor={"#f2f4f7"}>
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Comisión bancaria
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(resumen_propinas?.comision_bancaria || 0) || 0)}
                </Cell>
            </Row>
            <Row style={styles.cell_totales}>
                <Cell width="80%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(
                        Number(resumen_propinas?.utilidad_propinas || 0) +
                            Number(resumen_propinas?.comision_bancaria || 0)
                    )}
                </Cell>
            </Row>
            <Row style={styles.cell_totales}>
                <Cell width="80%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Monto recaudado
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(resumen_propinas?.monto_recaudado || 0))}
                </Cell>
            </Row>
        </Table>
    )
}

export default Propinas

