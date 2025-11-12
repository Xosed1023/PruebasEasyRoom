import { CaratulaPeriodoType } from "src/pages/Cortes/EjmPDF/sections/caratula-periodo.type"
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import { styles } from "../../TicketCaratulaStyles"

const MetodoPagoRow = ({
    title,
    porcentaje,
    total,
    color,
}: {
    title: string
    porcentaje: string
    total: string
    color?: string
}) => (
    <Row backgroundColor={color}>
        <Cell width="85%" textStyle={{ fontSize: 8 }}>
            {title}
        </Cell>
        <Cell width="20%" textStyle={{ fontSize: 8 }}>
            {porcentaje}
        </Cell>
        <Cell width="17%" textStyle={{ fontSize: 8 }}>
            {total || "-"}
        </Cell>
    </Row>
)

const EgresosMetodoPago = ({ caratula }: { caratula: CaratulaPeriodoType }) => {

    const empty = "$0.00"
    return (
        <Table style={{ marginTop: "10px", border: "1px solid #e3e3e3" }}>
            <Row backgroundColor="#f4f6f8">
                <Cell width="85%" textStyle={{ fontSize: 9 }}>
                    Ingresos por método de pago
                </Cell>
                <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Porcentaje por concepto
                </Cell>
                <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                    Total
                </Cell>
            </Row>
            {/* Bancos */}
            <MetodoPagoRow title="Bancos" porcentaje={caratula.gastos_metodo_pago.bancos.porcentaje_bancos + "%"} total={formatCurrencyToFixed(caratula.gastos_metodo_pago.bancos.total_bancos)} />
            <MetodoPagoRow color="#f4f6f8" title="AMEX" porcentaje={caratula.gastos_metodo_pago.bancos.amex.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.gastos_metodo_pago.bancos.amex.total))} />
            <MetodoPagoRow title="Visa o mastercard" porcentaje={caratula.gastos_metodo_pago.bancos.visa_o_mastercard.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.gastos_metodo_pago.bancos.visa_o_mastercard.total))} />
            <MetodoPagoRow color="#f4f6f8" title="Depósitos y transferencias" porcentaje={caratula.gastos_metodo_pago.bancos.deposito_o_transferencia.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.gastos_metodo_pago.bancos.deposito_o_transferencia.total))} />
            {/* Efectivo */}
            <MetodoPagoRow title="Efectivo" porcentaje={caratula.gastos_metodo_pago.efectivo.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.gastos_metodo_pago.efectivo.total))} />
            
            <Row
                style={styles.cell_totales}
                backgroundColor={caratula?.resumen_gastos_administrativos.detalles.length % 2 !== 0 ? "#f4f6f8" : ""}
            >
                <Cell width="85%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontSize: 9 }}>
                    {caratula?.gastos_metodo_pago.total_porcentaje
                        ? caratula?.gastos_metodo_pago.total_porcentaje + "%"
                        : "0%"}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {caratula?.gastos_metodo_pago.total
                        ? formatCurrencyToFixed(Number(caratula?.gastos_metodo_pago.total))
                        : empty}
                </Cell>
            </Row>
        </Table>
    )
}

export default EgresosMetodoPago
