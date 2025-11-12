import React from "react"
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { styles } from "../../TicketCaratulaStyles"
import { CaratulaPeriodoType } from "src/pages/Cortes/EjmPDF/sections/caratula-periodo.type"

const IngresosTable = ({ caratula }: { caratula: CaratulaPeriodoType }) => {
    return (
        <Table style={{ marginTop: "12px", border: "1px solid #e3e3e3" }}>
            <Row backgroundColor="#f4f6f8">
                <Cell width="40%" textStyle={{ fontSize: 9 }}>
                    Ingresos por estancia
                </Cell>
                <Cell width="13%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Cantidad
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Precio promedio
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Total de venta
                </Cell>
                <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Por concepto (%)
                </Cell>
            </Row>
            {caratula?.ingresos_estancia.detalles?.map((ingreso, index) => (
                <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                    <Cell width="40%" textStyle={{ fontSize: 8 }}>
                        {capitalizeString(ingreso.concepto)}
                    </Cell>
                    <Cell width="13%" textStyle={{ fontSize: 8 }}>
                        {ingreso.cantidad}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontSize: 8 }}>
                        {ingreso.precio_promedio ? formatCurrency(Number(ingreso.precio_promedio)) : "$0.00"}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontSize: 8 }}>
                        {ingreso.total_venta ? formatCurrency(Number(ingreso.total_venta)) : "$0.00"}
                    </Cell>
                    <Cell width="17%" textStyle={{ fontSize: 8 }}>
                        {Number(ingreso?.porcentaje_concepto || 0).toFixed(2) || "0"}%
                    </Cell>
                </Row>
            ))}
            <Row
                style={styles.cell_totales}
                backgroundColor={caratula?.ingresos_estancia?.detalles.length % 2 !== 0 ? "#f4f6f8" : ""}
            >
                <Cell width="40%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="13%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_estancia.totales.cantidad || 0}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {formatCurrency(caratula?.ingresos_estancia.totales.total_venta)}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {Number(caratula?.ingresos_estancia.totales.porcentaje_concepto || 0).toFixed(2) || "0"}%
                </Cell>
            </Row>
        </Table>
    )
}

export default IngresosTable
