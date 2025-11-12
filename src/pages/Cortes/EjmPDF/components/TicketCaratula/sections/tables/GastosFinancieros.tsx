import { CaratulaPeriodoType } from "src/pages/Cortes/EjmPDF/sections/caratula-periodo.type"
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import { styles } from "../../TicketCaratulaStyles"

const GastosFinancieros = ({ caratula }: { caratula: CaratulaPeriodoType }) => {
    const empty = "$0.00"
    return (
        <Table style={{ marginTop: "10px", border: "1px solid #e3e3e3" }}>
            <Row backgroundColor="#f4f6f8">
                <Cell width="53%" textStyle={{ fontSize: 9 }}>
                    Gastos administrativos
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Sobre venta (%)
                </Cell>
                <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Promedio por habitación
                </Cell>
            </Row>
            {caratula?.resumen_gastos_financieros.detalles?.map((categoria, index) => (
                <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                    <Cell width="53%" textStyle={{ fontSize: 8 }}>
                        {capitalizeString(categoria?.categoria || "")}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontSize: 8 }}>
                        {categoria?.total_gasto ? formatCurrencyToFixed(categoria?.total_gasto) : empty}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontSize: 8 }}>
                        {categoria?.porcentaje_venta || "-"}
                    </Cell>
                    <Cell width="17%" textStyle={{ fontSize: 8 }}>
                        {formatCurrencyToFixed(categoria?.promedio_habitacion) || empty}
                    </Cell>
                </Row>
            ))}
            <Row
                style={styles.cell_totales}
                backgroundColor={caratula?.resumen_gastos_financieros.detalles.length % 2 !== 0 ? "#f4f6f8" : ""}
            >
                <Cell width="53%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {caratula?.resumen_gastos_financieros.totales.total_gasto
                        ? formatCurrencyToFixed(caratula?.resumen_gastos_financieros.totales.total_gasto)
                        : empty}
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {caratula?.resumen_gastos_financieros.totales.porcentaje_venta
                        ? caratula?.resumen_gastos_financieros.totales.porcentaje_venta
                        : "0"}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {caratula?.resumen_gastos_financieros.totales.promedio_habitacion
                        ? formatCurrencyToFixed(caratula?.resumen_gastos_financieros.totales.promedio_habitacion)
                        : empty}
                </Cell>
            </Row>
        </Table>
    )
}

export default GastosFinancieros
