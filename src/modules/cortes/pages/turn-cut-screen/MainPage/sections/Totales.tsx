import { minus } from "@/helpers/calculator"
import { useEffect, useState } from "react"
import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { formatCurrency } from "@/helpers/format-currency"

const Totales = ({ resultado_corte, corte, totales, anticipo, manejo_efectivo }) => {
    const [diferenciaEfectivo, setDiferenciaEfectivo] = useState<number>(0)

    useEffect(() => {
        setDiferenciaEfectivo(
            corte?.corte?.fecha_cierre_corte
                ? minus(manejo_efectivo?.efectivo_caja || 0, corte?.corte?.efectivo_ingresado)
                : 0
        )
    }, [corte])

    return (
        <Table style={{ marginTop: 10, border: "0px", width: "100%" }}>
            <Row
                style={{
                    borderBottom: "0.5px solid #4A5468",
                }}
            >
                <Cell textStyle={{ fontWeight: 700, fontSize: 8 }}>Resultado del corte</Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Efectivo
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontWeight: 700,
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.efectivo || 0))}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Visa o mastercard
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.visa_o_mastercard || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Depósitos/Trans
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.deposito_transferencia || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    AMEX
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.amex || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Cortesías
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.cortesia || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Consumo interno
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.consumo_interno || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Love Points
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.love_points || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontSize: 7 }}>
                    Anticipos válidos
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(anticipo || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontSize: 7 }}>
                    Pago de propinas
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte.pago_propinas || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="28vw" textStyle={{ fontSize: 7 }}>
                    Gastos
                </Cell>
                <Cell
                    width="18vw"
                    textStyle={{
                        color: "#5E6470",
                        textAlign: "right",
                        fontSize: 7,
                    }}
                >
                    {formatCurrency(Number(resultado_corte?.gastos || 0) || 0)}
                </Cell>
            </Row>
            <Row
                style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    borderTop: "0.5px solid #4A5468",
                    borderBottom: "0.5px solid #4A5468",
                }}
            >
                <Cell textStyle={{ fontWeight: 700, width: "28vw", textAlign: "left", fontSize: 8, color: "#6941C6" }}>
                    {corte?.corte?.fecha_cierre_corte && diferenciaEfectivo !== 0 ? `Subtotal` : `Total`}
                </Cell>
                <Cell textStyle={{ fontWeight: 700, width: "18vw", textAlign: "right", fontSize: 8, color: "#6941C6" }}>
                    {formatCurrency(Number(totales?.subtotal || 0) || 0)}
                </Cell>
            </Row>
            {corte?.corte?.fecha_cierre_corte && diferenciaEfectivo > 0 ? (
                <Row>
                    <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                        Faltante
                    </Cell>
                    <Cell
                        width="18vw"
                        textStyle={{
                            color: "#5E6470",
                            textAlign: "right",
                            fontSize: 8,
                        }}
                    >
                        {formatCurrency(diferenciaEfectivo > 0 ? Math.abs(diferenciaEfectivo) : 0)}
                    </Cell>
                </Row>
            ) : corte?.corte?.fecha_cierre_corte && diferenciaEfectivo < 0 ? (
                <Row>
                    <Cell width="28vw" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                        Sobrante
                    </Cell>
                    <Cell
                        width="18vw"
                        textStyle={{
                            color: "#5E6470",
                            textAlign: "right",
                            fontSize: 8,
                        }}
                    >
                        {formatCurrency(diferenciaEfectivo < 0 ? Math.abs(diferenciaEfectivo) : 0)}
                    </Cell>
                </Row>
            ) : null}
            {corte?.corte?.fecha_cierre_corte && diferenciaEfectivo !== 0 && (
                <Row
                    style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderTop: "0.5px solid #4A5468",
                        borderBottom: "0.5px solid #4A5468",
                    }}
                >
                    <Cell
                        textStyle={{ fontSize: 8, fontWeight: 700, width: "28vw", textAlign: "left", color: "#7241FA" }}
                    >
                        Total
                    </Cell>
                    <Cell
                        textStyle={{
                            fontSize: 8,
                            fontWeight: 700,
                            width: "18vw",
                            textAlign: "right",
                            color: "#7241FA",
                        }}
                    >
                        {formatCurrency(minus(Number(totales?.total || 0), diferenciaEfectivo) || 0)}
                    </Cell>
                </Row>
            )}
        </Table>
    )
}

export default Totales
