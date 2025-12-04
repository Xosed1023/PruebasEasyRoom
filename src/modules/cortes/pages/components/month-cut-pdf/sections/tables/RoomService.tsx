import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { styles } from "../../TicketCaratulaStyles"
import { CaratulaPeriodoType } from "../../caratula-periodo.type"
import { capitalizeString } from "@/helpers/capitalize"
import { formatCurrencyToFixed } from "@/helpers/format-currency"

const RoomServiceCaratula = ({ caratula }: { caratula: CaratulaPeriodoType }) => {
    const empty = "$0.00"
    return (
        <Table style={{ marginTop: "10px", border: "1px solid #e3e3e3" }}>
            <Row backgroundColor="#f4f6f8">
                <Cell width="53%" textStyle={{ fontSize: 9 }}>
                    Room Service
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
            {caratula?.ingresos_roomservice?.detalles?.map((rs, index) => (
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
                backgroundColor={caratula?.ingresos_roomservice?.detalles.length % 2 !== 0 ? "#f4f6f8" : ""}
            >
                <Cell width="68%" textStyle={{ fontWeight: 500, fontSize: 9 }}>
                    Total
                </Cell>
                <Cell width="15%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_roomservice?.totales?.total_venta
                        ? formatCurrencyToFixed(caratula?.ingresos_roomservice?.totales?.total_venta)
                        : empty}
                </Cell>
                <Cell width="17%" textStyle={{ fontSize: 9 }}>
                    {caratula?.ingresos_roomservice?.totales?.porcentaje_concepto
                        ? String(caratula?.ingresos_roomservice?.totales?.porcentaje_concepto)
                        : "0"}%
                </Cell>
            </Row>
        </Table>
    )
}

export default RoomServiceCaratula
