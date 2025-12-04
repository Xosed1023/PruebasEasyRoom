import { useEffect, useState } from "react"
import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { formatCurrency } from "@/helpers/format-currency"
import { styles } from "../../styles"
import { CortesPDF } from "../../../interfaces/cortes-pdf"

const Gastos = ({ cortes_pdf, fajillas }: {cortes_pdf: CortesPDF, fajillas: any}) => {
    const [totalFinal, setTotalFinal] = useState<any>({ efectivo: 0, gastos: 0, total: 0 })

    useEffect(() => {
        let totEfectivo = 0
        let totGastos = 0
        if (cortes_pdf) {
            fajillas?.map((faj) => {
                totEfectivo = totEfectivo + parseFloat(faj.total)
            })
            cortes_pdf.gastos.map((gasto) => {
                totGastos = totGastos + parseFloat(gasto.total)
            })
            setTotalFinal({ efectivo: totEfectivo, gastos: totGastos, total: totEfectivo - totGastos })
        }
    }, [cortes_pdf])

    return (
        <Table style={{ border: "0.5px solid var(--placeholder)" }}>
            <Row backgroundColor="#eaecf0">
                <Cell width="64%" textStyle={{ fontSize: 8 }}>
                    Gastos de fondo de caja
                </Cell>
                <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    #
                </Cell>
                <Cell width="18%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    Total
                </Cell>
            </Row>
            {cortes_pdf?.gastos.map((gasto, index) => (
                <Row backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""} key={index}>
                    <Cell width="64%" textStyle={{ fontSize: 7 }}>
                        {gasto.subcategoria}
                    </Cell>
                    <Cell width="18%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        1
                    </Cell>
                    <Cell width="18%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {formatCurrency(Number(gasto.total || 0) || 0)}
                    </Cell>
                </Row>
            ))}
            <Row style={styles.cell_totales}>
                <Cell width="82%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(totalFinal.gastos || 0) || 0)}
                </Cell>
            </Row>
        </Table>
    )
}

export default Gastos
