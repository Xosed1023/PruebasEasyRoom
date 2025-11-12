import React, { useEffect, useState } from "react"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import Table from "../../PDFTable/Table/Table"
import Row from "../../PDFTable/Row/Row"
import Cell from "../../PDFTable/Cell/Cell"
import { styles } from "../../TicketCaratula/TicketCaratulaStyles"
import { EarlyCheckin, ICortes } from "../../../sections/interfaces/cortes-pdf"

const Ingresos = ({ cortes_pdf }: { cortes_pdf: ICortes }) => {
    const cortes_data = cortes_pdf?.cortes_pdf

    const calcularTotal = (items) => {
        let total = 0
        let cantidad = 0
        if (items) {
            items.forEach((item) => {
                total += parseFloat(item.total) || 0
                cantidad += parseInt(item.cantidad) || 0
            })
        }
        return { promedio: total / cantidad, cantidad, total }
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

    const [totalHab, setTotalHab] = useState<any>(() => calcularTotal(cortes_data?.habitaciones))
    const [totalExtras, setTotalExtras] = useState<any>(() =>
        calcularTotalExtras(cortes_data?.extras, cortes_data?.early_checkin)
    )
    const [totalSal, setTotalSal] = useState<any>(() => calcularTotal(cortes_data?.saldos_reservas))
    const [totalRoomService, setTotalRoomService] = useState<any>(() => ({
        promedio: cortes_data?.roomservice?.totales?.precio_promedio_total || 0,
        cantidad: cortes_data?.roomservice?.totales?.cantidad_total || 0,
        total: cortes_data?.roomservice?.totales?.monto_total || 0,
    }))

    useEffect(() => {
        setTotalHab(calcularTotal(cortes_data?.habitaciones))
        setTotalSal(calcularTotal(cortes_data?.saldos_reservas))
        setTotalRoomService({
            promedio: cortes_data?.roomservice?.totales?.precio_promedio_total || 0,
            cantidad: cortes_data?.roomservice?.totales?.cantidad_total || 0,
            total: cortes_data?.roomservice?.totales?.monto_total || 0,
        })
        setTotalExtras(calcularTotalExtras(cortes_data?.extras, cortes_data?.early_checkin))
    }, [cortes_data])

    return (
        <Table style={{ marginTop: "10px" }}>
            <Row backgroundColor="#eaecf0">
                <Cell width="80%" textStyle={{ fontSize: 8 }}>
                   Total de ingresos
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 8, textAlign: "right" }}>
                    Total
                </Cell>
            </Row>
            <Row>
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Estancia
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(totalHab.total || 0) + Number(totalExtras.total || 0) || 0)}
                </Cell>
            </Row>
            <Row backgroundColor="#f2f4f7">
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Room Service
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(totalRoomService.total || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Restaurante
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_pdf?.cortes_pdf.restaurante?.totales?.monto_total || 0) || 0)}
                </Cell>
            </Row>
            <Row backgroundColor="#f2f4f7">
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Propinas
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(cortes_data?.propinas?.total || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Anticipo de reserva
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_data?.anticipos_reserva.total || 0) || 0)}
                </Cell>
            </Row>
            <Row>
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Paquetes y T. dinámicas
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(cortes_data?.experiencias?.[0]?.total || 0) || 0)}
                </Cell>
            </Row>
            <Row backgroundColor="#f2f4f7">
                <Cell width="80%" textStyle={{ fontSize: 7 }}>
                    Saldo de reserva
                </Cell>
                <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                    {formatCurrency(Number(totalSal.total || 0) || 0)}
                </Cell>
            </Row>

            <Row style={styles.cell_totales}>
                <Cell width="80%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                    {formatCurrency(Number(cortes_data?.suma_totales_ingresos || 0) || 0)}
                </Cell>
            </Row>
        </Table>
    )
}

export default Ingresos