import React from "react"
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import { styles } from "../../TicketCaratulaStyles"
import { CaratulaPeriodoType } from "src/pages/Cortes/EjmPDF/sections/caratula-periodo.type"

const RestauranteCaratula = ({ caratula }: { caratula: CaratulaPeriodoType }) => {
    const empty = "$0.00"
    return (
        <Table style={{ marginTop: "10px", border: "1px solid #e3e3e3" }}>
            <Row backgroundColor="#f4f6f8">
                <Cell width="53%" textStyle={{ fontSize: 9 }}>
                    Restaurante
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Promedio diario
                </Cell>
                <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Por concepto (%)
                </Cell>
            </Row>
            {caratula?.ingresos_restaurante?.detalles?.map((rs, index) => (
                <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                    <Cell width="53%" textStyle={{ fontSize: 8 }}>
                        {capitalizeString(rs.concepto)}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontSize: 8 }}>
                        {rs.total_venta ? formatCurrencyToFixed(rs.total_venta) : empty}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontSize: 8 }}>
                        {rs.precio_promedio ? formatCurrencyToFixed(rs.precio_promedio) : empty}
                    </Cell>
                    <Cell width="17%" textStyle={{ fontSize: 8 }}>
                        {rs.porcentaje_concepto ? rs.porcentaje_concepto.toFixed(2) : empty}%
                    </Cell>
                </Row>
            ))}
            <Row
                style={styles.cell_totales}
                backgroundColor={caratula?.ingresos_restaurante?.detalles.length % 2 !== 0 ? "#f4f6f8" : ""}
            >
                <Cell width="68%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_restaurante?.totales?.total_venta
                        ? formatCurrencyToFixed(caratula?.ingresos_restaurante?.totales?.total_venta)
                        : empty}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_restaurante?.totales?.porcentaje_concepto
                        ? String(caratula?.ingresos_restaurante?.totales?.porcentaje_concepto)
                        : "0"}%
                </Cell>
            </Row>
        </Table>
    )
}

export default RestauranteCaratula
