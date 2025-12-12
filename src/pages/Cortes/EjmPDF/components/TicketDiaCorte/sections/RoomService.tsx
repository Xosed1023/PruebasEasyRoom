import { formatCurrency } from "src/shared/hooks/formatCurrency"
import Table from "../../PDFTable/Table/Table"
import Row from "../../PDFTable/Row/Row"
import Cell from "../../PDFTable/Cell/Cell"
import { styles } from "../../TicketCaratula/TicketCaratulaStyles"
import { v4 as uuid } from "uuid"
import { CortesPDF, TicketsPromedio } from "../../../sections/interfaces/cortes-pdf"
interface Props {
    cortes_pdf: CortesPDF;
    ticket_promedio?: TicketsPromedio;
}
const RoomService = ({ cortes_pdf, ticket_promedio }: Props) => {
    const totalRoomService = Number(cortes_pdf?.roomservice?.totales?.monto_total) || 0
    const totalCanRoomService = Number(cortes_pdf?.roomservice?.totales?.cantidad_total) || 0

    return (
        <>
            <Table style={{ marginTop: "10px" }}>
                <Row backgroundColor="#eaecf0">
                    <Cell width="35%" textStyle={{ fontSize: 8 }}>
                        Room Service
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
                {cortes_pdf?.roomservice?.desgloce?.map((rs, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""} key={uuid()}>
                        <Cell width="35%" textStyle={{ fontSize: 7 }}>
                            {rs.concepto}
                        </Cell>
                        <Cell width="25%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {formatCurrency(Number(rs.precio_promedio || 0) || 0)}
                        </Cell>
                        <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {rs.cantidad || 0}
                        </Cell>
                        <Cell width="20%" textStyle={{ textAlign: "right", fontSize: 7 }}>
                            {formatCurrency(Number(rs.total || 0) || 0)}
                        </Cell>
                    </Row>
                ))}
                <Row style={styles.cell_totales}>
                    <Cell width="60%" textStyle={{ fontWeight: 600, fontSize: 7 }}>
                        Total
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                        {totalCanRoomService}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontWeight: 600, fontSize: 7, textAlign: "right" }}>
                        {formatCurrency(totalRoomService)}
                    </Cell>
                </Row>
            </Table>
            <Table style={{ border: "none" }}>
                <Row>
                    <Cell
                        width="30%"
                        textStyle={{
                            fontWeight: 700,
                            fontSize: 7,
                            border: "0.5px solid var(--placeholder)",
                            borderTop: "none",
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
                        {formatCurrency(Number(ticket_promedio?.room_service || 0) || 0)}
                    </Cell>
                </Row>
            </Table>
        </>
    )
}

export default RoomService
