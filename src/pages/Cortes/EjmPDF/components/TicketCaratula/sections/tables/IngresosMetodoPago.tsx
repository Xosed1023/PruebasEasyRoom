import { CaratulaPeriodoType } from "src/pages/Cortes/EjmPDF/sections/caratula-periodo.type"
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"
import { styles } from "../../TicketCaratulaStyles"
import { Text } from "@react-pdf/renderer"

const MetodoPagoRow = ({
    title,
    porcentaje,
    total,
    color,
}: {
    title: JSX.Element | string
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

const IngresosMetodoPago = ({ caratula }: { caratula: CaratulaPeriodoType }) => {

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
            <MetodoPagoRow title={<Text style={{fontWeight: "bold", fontFamily: "Roboto"}}>Bancos</Text>} porcentaje={caratula.ingresos_metodo_pago.bancos.porcentaje_bancos + "%"} total={formatCurrencyToFixed(caratula.ingresos_metodo_pago.bancos.total_bancos)} />
            <MetodoPagoRow color="#f4f6f8" title="AMEX" porcentaje={caratula.ingresos_metodo_pago.bancos.amex.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.bancos.amex.total))} />
            <MetodoPagoRow title="Visa o mastercard" porcentaje={caratula.ingresos_metodo_pago.bancos.visa_o_mastercard.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.bancos.visa_o_mastercard.total))} />
            <MetodoPagoRow color="#f4f6f8" title="Depósitos y transferencias" porcentaje={caratula.ingresos_metodo_pago.bancos.deposito_o_transferencia.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.bancos.deposito_o_transferencia.total))} />
            {/* Efectivo */}
            <MetodoPagoRow title={<Text style={{fontWeight: "bold"}}>Efectivo</Text>} porcentaje={caratula.ingresos_metodo_pago.efectivo.porcentaje_efectivo + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.efectivo.total_efectivo))} />
            {/* Otros */}
            <MetodoPagoRow color="#f4f6f8" title={<Text style={{fontWeight: "bold"}}>Otros</Text>} porcentaje={caratula.ingresos_metodo_pago.otros.porcentaje_otros + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.otros.total_otros))} />
            <MetodoPagoRow title="Consumo interno" porcentaje={caratula.ingresos_metodo_pago.otros.consumo_interno.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.otros.consumo_interno.total))} />
            <MetodoPagoRow color="#f4f6f8" title="Cortesías" porcentaje={caratula.ingresos_metodo_pago.otros.cortesia.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.otros.cortesia.total))} />
            <MetodoPagoRow title="Cortesías" porcentaje={caratula.ingresos_metodo_pago.otros.cortesia.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.otros.cortesia.total))} />
            <MetodoPagoRow color="#f4f6f8" title="Love points" porcentaje={caratula.ingresos_metodo_pago.otros.love_points.porcentaje_concepto + "%"} total={formatCurrencyToFixed(Number(caratula.ingresos_metodo_pago.otros.love_points.total))} />
            
            
            <Row
                style={styles.cell_totales}
                backgroundColor={caratula?.resumen_gastos_administrativos.detalles.length % 2 !== 0 ? "#f4f6f8" : ""}
            >
                <Cell width="85%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="20%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_metodo_pago.total_porcentaje
                        ? caratula?.ingresos_metodo_pago.total_porcentaje + "%"
                        : "0%"}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_metodo_pago.total
                        ? formatCurrencyToFixed(Number(caratula?.ingresos_metodo_pago.total))
                        : empty}
                </Cell>
            </Row>
        </Table>
    )
}

export default IngresosMetodoPago
