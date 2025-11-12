import React from "react"
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import { styles } from "../../TicketCaratulaStyles"
import { CaratulaPeriodoType } from "src/pages/Cortes/EjmPDF/sections/caratula-periodo.type"

const TotalIngresos = ({ caratula }: { caratula: CaratulaPeriodoType }) => {
    const empty = "$0.00"
    return (
        <Table style={{ marginTop: "10px", border: "1px solid #e3e3e3" }}>
            <Row backgroundColor="#f4f6f8">
                <Cell width="53%" textStyle={{ fontSize: 9 }}>
                    Ingresos totales
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Promedio diario
                </Cell>
                <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Promedio por habitación
                </Cell>
            </Row>
            {/* hotel */}
            <Row>
                <Cell width="53%" textStyle={{ fontSize: 8 }}>
                    Hotel
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.hotel.total)}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.hotel.promedio_diario)}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.hotel.promedio_habitacion)}
                </Cell>
            </Row>
            {/* room service */}
            <Row backgroundColor="#f4f6f8">
                <Cell width="53%" textStyle={{ fontSize: 8 }}>
                    Room service
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.room_service.total)}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.room_service.promedio_diario)}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.room_service.promedio_habitacion)}
                </Cell>
            </Row>
            {/* Restaurante */}
            <Row>
                <Cell width="53%" textStyle={{ fontSize: 8 }}>
                    Restaurante
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.restaurante.total)}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.restaurante.promedio_diario)}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(caratula?.ingresos_totales.restaurante.promedio_habitacion)}
                </Cell>
            </Row>
            {/* Propinas */}
            <Row backgroundColor="#f4f6f8">
                <Cell width="53%" textStyle={{ fontSize: 8 }}>
                    Propinas
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(Number(caratula?.ingresos_totales.propinas_total.total))}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(Number(caratula?.ingresos_totales.propinas_total.promedio_diario))}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 8 }}>
                    {formatCurrencyToFixed(Number(caratula?.ingresos_totales.propinas_total.promedio_habitacion))}
                </Cell>
            </Row>
            <Row style={styles.cell_totales}>
                <Cell width="53%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_totales.total.total
                        ? formatCurrencyToFixed(caratula?.ingresos_totales.total.total)
                        : empty}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_totales.total.promedio_diario
                        ? formatCurrencyToFixed(caratula?.ingresos_totales.total.promedio_diario)
                        : empty}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_totales.total.promedio_habitacion
                        ? formatCurrencyToFixed(caratula?.ingresos_totales.total.promedio_habitacion)
                        : empty}
                </Cell>
            </Row>
        </Table>
    )
}

export default TotalIngresos
