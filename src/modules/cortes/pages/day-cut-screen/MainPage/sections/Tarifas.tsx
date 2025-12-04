import { useEffect, useMemo, useState } from "react"
import { formatCurrency } from "@/helpers/format-currency"
import Table from "../../../components/PDFTable/Table/Table"
import Row from "../../../components/PDFTable/Row/Row"
import Cell from "../../../components/PDFTable/Cell/Cell"
import { styles } from "../../styles"
import { CortesPDF, EarlyCheckin, TicketsPromedio } from "../../../interfaces/cortes-pdf"

interface Props {
    cortes_pdf: CortesPDF;
    ticket_promedio?: TicketsPromedio;
}

const Tarifas = ({ cortes_pdf, ticket_promedio }: Props) => {
    const calcularTotalHab = (cortes_pdf) => {
        let totHab = 0
        let totCantHab = 0

        if (cortes_pdf?.habitaciones) {
            cortes_pdf.habitaciones.forEach((hab) => {
                totHab += parseFloat(hab.total) || 0
                totCantHab += parseInt(hab.cantidad) || 0
            })
        }

        return {
            promedio: totHab / totCantHab,
            cantidad: totCantHab,
            total: totHab,
        }
    }

    const calcularTotalExtras = (extras: EarlyCheckin[], earlyCheckin: EarlyCheckin) => {
        let total = 0
        let cantidad = 0
        extras.forEach((extra) => {
            total += Number(extra.total) || 0
            cantidad += Number(extra.cantidad) || 0
        })

        total += earlyCheckin?.total || 0
        cantidad += earlyCheckin?.cantidad || 0

        return {
            total,
            cantidad,
            promedio: cantidad ? total / cantidad : 0,
        }
    }

    const [totalHabitaciones, setTotalHabitaciones] = useState<any>(() => calcularTotalHab(cortes_pdf))
    const [totalExtras, setTotalExtras] = useState<any>(() =>
        calcularTotalExtras(cortes_pdf?.extras, cortes_pdf?.early_checkin)
    )

    useEffect(() => {
        setTotalHabitaciones(calcularTotalHab(cortes_pdf))
        setTotalExtras(calcularTotalExtras(cortes_pdf?.extras, cortes_pdf?.early_checkin))
    }, [cortes_pdf])

        const totalEstancia: { cantidad: number; total: number } = useMemo(() => {
        const cantidad = Number(totalHabitaciones.cantidad || 0) + Number(totalExtras.cantidad || 0)
        const total = Number(totalHabitaciones.total || 0) + Number(totalExtras.total || 0)
        return {
            cantidad,
            total,
        }
    }, [totalHabitaciones, totalExtras])

    return (
        <>
        <Table>
                <Row backgroundColor="#eaecf0">
                    <Cell width="35%" textStyle={{ fontSize: 8 }}>
                        Habitaciones
                    </Cell>
                    <Cell width="25%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                        Tarifa base
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                        #
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                        Total
                    </Cell>
                </Row>
                {cortes_pdf?.habitaciones.map((hb, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""} key={index}>
                        <Cell width="35%" textStyle={{ fontSize: 7 }}>
                            {hb.concepto}
                        </Cell>
                        <Cell width="25%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {formatCurrency(Number(hb.precio_promedio || 0) || 0)}
                        </Cell>
                        <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {hb.cantidad}
                        </Cell>
                        <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {formatCurrency(Number(hb.total || 0) || 0)}
                        </Cell>
                    </Row>
                ))}
                <Row style={styles.cell_totales_habitaciones}>
                    <Cell width="60%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                        Total
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                        {totalHabitaciones.cantidad}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(totalHabitaciones.total || 0))}
                    </Cell>
                </Row>

                <Row backgroundColor="#eaecf0">
                    <Cell width="35%" textStyle={{ fontSize: 8 }}>
                        Extras de estancia
                    </Cell>
                    <Cell width="25%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                        Precio promedio
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                        #
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                        Total
                    </Cell>
                </Row>
                <Row>
                    <Cell width="35%" textStyle={{ fontSize: 7 }}>
                        Check-in anticipado
                    </Cell>
                    <Cell width="25%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {formatCurrency(Number(cortes_pdf?.early_checkin?.precio_promedio || 0) || 0)}
                    </Cell>
                    <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {cortes_pdf?.early_checkin?.cantidad}
                    </Cell>
                    <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                        {formatCurrency(Number(cortes_pdf?.early_checkin?.total || 0) || 0)}
                    </Cell>
                </Row>
                {cortes_pdf?.extras.map((ex, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "" : "#f2f4f7"} key={index}>
                        <Cell width="35%" textStyle={{ fontSize: 7 }}>
                            {ex.concepto ? ex.concepto.charAt(0).toUpperCase() + ex.concepto.slice(1) : ""}s extra
                        </Cell>
                        <Cell width="25%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {formatCurrency(Number(ex.precio_promedio || 0) || 0)}
                        </Cell>
                        <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {ex.cantidad}
                        </Cell>
                        <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {formatCurrency(Number(ex.total || 0) || 0)}
                        </Cell>
                    </Row>
                ))}
                <Row style={styles.cell_totales_habitaciones}>
                    <Cell width="60%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                        Total
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                        {totalExtras.cantidad}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(totalExtras.total || 0))}
                    </Cell>
                </Row>
                <Row backgroundColor="#F9FAFB">
                    <Cell width="60%" textStyle={{ fontWeight: 700, fontSize: 7 }}>
                        Total estancia
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 700, fontSize: 7, textAlign: "right" }}>
                        {totalEstancia.cantidad}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 700, fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(Number(totalEstancia.total || 0))}
                    </Cell>
                </Row>
            </Table>
            <Table style={{ border: "0px" }}>
                <Row>
                    <Cell
                        width="30%"
                        textStyle={{
                            fontWeight: 700,
                            fontSize: 7,
                            border: "0.5px solid var(--placeholder)",
                            borderTop: "0px",
                        }}
                    >
                        Ticket promedio
                    </Cell>
                    <Cell
                        width="20%"
                        textStyle={{
                            fontWeight: 700,
                            fontSize: 7,
                            textAlign: "right",
                            borderRight: "0.5px solid var(--placeholder)",
                            borderBottom: "0.5px solid var(--placeholder)",
                        }}
                    >
                        {formatCurrency(Number(ticket_promedio?.estancia || 0))}
                    </Cell>
                </Row>
            </Table></>
    )
}

export default Tarifas
