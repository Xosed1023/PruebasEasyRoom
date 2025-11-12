/* eslint-disable indent */
import { Document, Page, View } from "@react-pdf/renderer"
import { ResumenPagos } from "../../sections/interfaces/resumen-pagos"
import { IResumenCorte } from "../../sections/interfaces/resumen-corte"
import { useEffect, useState } from "react"
import Row from "../PDFTable/Row/Row"
import Cell from "../PDFTable/Cell/Cell"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { v4 as uuid } from "uuid"
import Table from "../PDFTable/Table/Table"
import { minus, sum } from "src/shared/helpers/calculator"
import { ManejoEfectivo, ResumenGastos, ResumenIngresos, Subtotales } from "./TicketResumen.interfaces"
import Footer from "./sections/footer/Footer"
import Header from "./sections/header/Header"
import { capitalizeString } from "src/shared/hooks/capitalizeString"

const TicketResumen = ({
    resumenCorte,
    resumenPagos,
    user,
    turno,
    efectivo_ingresado,
    fechaInicioCorte,
}: {
    resumenCorte?: IResumenCorte
    resumenPagos?: ResumenPagos
    user?: string
    turno?: string
    fechaInicioCorte?: Date
    efectivo_ingresado?: number
}) => {
    const [resumenIngresos, setResumenIngresos] = useState<ResumenIngresos>({ ingresos: [], total: 0 })

    const [manejoEfectivo, setManejoEfectivo] = useState<ManejoEfectivo[]>([])

    const [resumenGastos, setResumenGastos] = useState<ResumenGastos>({ gastos: [], total: 0 })

    const [subtotales, setSubtotales] = useState<Subtotales>({ subtotales: [], total: 0 })

    // Tabla ingresos
    useEffect(() => {
        const ingresosList = [
            ...(resumenCorte?.habitaciones?.length
                ? resumenCorte.habitaciones.map((h) => ({
                      concepto: "Habitación " + h.concepto,
                      cantidad: h.cantidad,
                      precio_promedio: Number(Number(h.precio_promedio).toFixed(2)),
                      total: Number(Number(h.total).toFixed(2)),
                  }))
                : []),
            ...(resumenCorte?.extras?.length
                ? resumenCorte.extras.map((extra) => ({
                      concepto: capitalizeString(extra.concepto) + " extra",
                      cantidad: extra.cantidad,
                      precio_promedio: Number(Number(extra.precio_promedio).toFixed(2)),
                      total: Number(Number(extra.total).toFixed(2)),
                  }))
                : []),
            ...(resumenCorte?.anticipos_reserva.length
                ? resumenCorte.anticipos_reserva.map((a_r) => ({
                      concepto: "Anticipo de reervas",
                      cantidad: a_r.cantidad,
                      precio_promedio: "-",
                      total: Number(Number(a_r.total).toFixed(2)),
                  }))
                : []),
            ...(resumenCorte?.saldos_reservas.length
                ? resumenCorte.saldos_reservas.map((s_r) => ({
                      concepto: "Saldo de reservas",
                      cantidad: s_r.cantidad,
                      precio_promedio: "-",
                      total: Number(Number(s_r.total).toFixed(2)),
                  }))
                : []),
            {
                concepto: "Room service",
                cantidad: resumenCorte?.roomservice.cantidad_total,
                precio_promedio: "-",
                total: Number(Number(resumenCorte?.roomservice.monto_total).toFixed(2)),
            },
        ]

        setResumenIngresos({ ingresos: ingresosList, total: ingresosList.reduce((acc, cur) => acc + cur.total, 0) })
    }, [resumenPagos, resumenCorte])
    // Tabla manejo efectivo
    useEffect(() => {
        const efectivo_en_caja =
            (resumenPagos?.total_efectivo || 0) -
            (resumenPagos?.total_fajillas || 0) -
            (resumenPagos?.total_gastos || 0)

        setManejoEfectivo([
            ...(resumenCorte?.fajillas?.length
                ? resumenCorte.fajillas.map((f) => ({
                      concepto: "Retiro de efectivo",
                      cantidad: f.cantidad,
                      monto: f.monto,
                      total: f.total,
                  }))
                : []),
            {
                concepto: "Efectivo en caja",
                total: efectivo_en_caja,
            },
        ])
    }, [resumenPagos, resumenCorte])

    // Tabla gastos
    useEffect(() => {
        setResumenGastos({
            gastos: [
                ...(resumenCorte?.gastos?.length
                    ? resumenCorte.gastos.map((gasto) => ({
                          concepto: gasto.subcategoria,
                          total: gasto.total,
                      }))
                    : []),
            ],
            total: resumenCorte?.gastos.reduce((acc, curr) => acc + curr.total, 0),
        })
    }, [resumenCorte])

    // Tabla subtotal
    useEffect(() => {
        const subtotalVisaMasterCard = sum([
            resumenPagos?.habitaciones?.visa_master || 0,
            resumenPagos?.reservas.visa_master || 0,
            resumenPagos?.room_service.visa_master || 0,
        ])
        const subtotalCortesia = sum([
            resumenPagos?.habitaciones?.cortesia || 0,
            resumenPagos?.room_service.cortesia || 0,
        ])
        const subtotalConsumoInterno = sum([
            resumenPagos?.habitaciones?.consumo_interno || 0,
            resumenPagos?.room_service.consumo_interno || 0,
        ])
        const subtotalAMEX = sum([
            resumenPagos?.habitaciones?.amex || 0,
            resumenPagos?.reservas.amex || 0,
            resumenPagos?.room_service.amex || 0,
        ])
        const subtotalDeposito = sum([
            resumenPagos?.habitaciones?.deposito || 0,
            resumenPagos?.reservas.deposito || 0,
            resumenPagos?.room_service.deposito || 0,
        ])

        const efectivoAntesDeGastos = resumenPagos?.total_efectivo
        const gastos = resumenPagos?.total_gastos || 0
        const efectivoDespuesDeGastos = resumenPagos?.efectivo_menos_gastos || 0

        const efectivo_en_caja =
            (resumenPagos?.total_efectivo || 0) -
            (resumenPagos?.total_fajillas || 0) -
            (resumenPagos?.total_gastos || 0)

        const sobranteOFaltante = minus(efectivo_en_caja || 0, efectivo_ingresado || 0)
        const totalConsumoCortesia = sum([subtotalCortesia, subtotalConsumoInterno])
        setSubtotales({
            subtotales: [
                { concepto: "Visa o mastercard", total: subtotalVisaMasterCard },
                { concepto: "AMEX", total: subtotalAMEX },
                { concepto: "Deposito/Transferencia", total: subtotalDeposito },
                { concepto: "Efectivo antes de gastos", total: efectivoAntesDeGastos },
                { concepto: "Gastos", total: -gastos },
                { concepto: "Efectivo después de gastos", total: efectivoDespuesDeGastos },
                { concepto: "Cortesías", total: subtotalCortesia },
                { concepto: "Consumo interno", total: subtotalConsumoInterno },
                ...(sobranteOFaltante === 0
                    ? [
                          { concepto: "Sobrante", total: sobranteOFaltante },
                          { concepto: "Faltante", total: sobranteOFaltante },
                      ]
                    : sobranteOFaltante > 0
                    ? [{ concepto: "Sobrante", total: sobranteOFaltante }]
                    : [{ concepto: "Faltante", total: sobranteOFaltante }]),
            ],
            total: minus(
                sum([subtotalVisaMasterCard, subtotalAMEX, subtotalDeposito, efectivoDespuesDeGastos]),
                totalConsumoCortesia
            ),
        })
    }, [resumenPagos])

    return (
        <Document title="Resumen Corte">
            <Page
                size="A4"
                style={{
                    width: "100%",
                    backgroundColor: "white",
                    padding: "10px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <View>
                    <Header turno={turno} user={user} fechaCierreCorte={fechaInicioCorte} />
                    <Table style={{ marginTop: "10px" }}>
                        <Row backgroundColor="#f4f6f8">
                            <Cell width="58%" textStyle={{ fontWeight: 500 }}>
                                Ingresos
                            </Cell>
                            <Cell width="10%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Cantidad
                            </Cell>
                            <Cell width="20%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Precio promedio
                            </Cell>
                            <Cell width="12%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Total
                            </Cell>
                        </Row>
                        {resumenIngresos.ingresos.map((rh, index) => (
                            <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={uuid()}>
                                <Cell width="58%">{rh.concepto}</Cell>
                                <Cell width="10%" textStyle={{ textAlign: "right" }}>
                                    {String(rh.cantidad)}
                                </Cell>
                                <Cell width="20%" textStyle={{ textAlign: "right" }}>
                                    {formatCurrency(Number(rh.precio_promedio || 0) || 0)}
                                </Cell>
                                <Cell width="12%" textStyle={{ textAlign: "right" }}>
                                    {formatCurrency(rh.total || 0)}
                                </Cell>
                            </Row>
                        ))}
                        <Row backgroundColor={resumenIngresos.ingresos.length % 2 !== 0 ? "#f4f6f8" : ""} key={uuid()}>
                            <Cell width="70%" textStyle={{ fontWeight: 500 }}>
                                Total
                            </Cell>
                            <Cell width="30%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                {formatCurrency(resumenIngresos.total || 0)}
                            </Cell>
                        </Row>
                    </Table>
                    <Table style={{ marginTop: "10px" }}>
                        <Row backgroundColor="#f4f6f8">
                            <Cell width="58%" textStyle={{ fontWeight: 500 }}>
                                Manejo de efectivo
                            </Cell>
                            <Cell width="10%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Cantidad
                            </Cell>
                            <Cell width="20%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Monto
                            </Cell>
                            <Cell width="12%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Total
                            </Cell>
                        </Row>
                        {manejoEfectivo.map((me, index) => (
                            <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={uuid()}>
                                <Cell width="58%">{me.concepto}</Cell>
                                <Cell width="10%" textStyle={{ textAlign: "right" }}>
                                    {me.cantidad === undefined ? "" : String(me.cantidad)}
                                </Cell>
                                <Cell width="20%" textStyle={{ textAlign: "right" }}>
                                    {me.monto === undefined ? "" : formatCurrency(me.monto || 0)}
                                </Cell>
                                <Cell width="12%" textStyle={{ textAlign: "right" }}>
                                    {formatCurrency(me.total || 0)}
                                </Cell>
                            </Row>
                        ))}
                    </Table>
                    <Table style={{ marginTop: "10px" }}>
                        <Row backgroundColor="#f4f6f8">
                            <Cell width="80%" textStyle={{ fontWeight: 500 }}>
                                Gastos (fondo de caja)
                            </Cell>
                            <Cell width="20%" textStyle={{ textAlign: "right", fontWeight: 500 }}>
                                Total
                            </Cell>
                        </Row>
                        {resumenGastos.gastos?.map((gasto, index) => (
                            <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={uuid()}>
                                <Cell width="80%">{String(gasto?.concepto || "")}</Cell>
                                <Cell width="20%" textStyle={{ textAlign: "right" }}>
                                    -{formatCurrency(gasto.total || 0)}
                                </Cell>
                            </Row>
                        ))}
                    </Table>
                    <View
                        style={{
                            width: "100%",
                            marginTop: 6,
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <View style={{ width: "54%" }}></View>
                        <Table style={{ border: "none", width: "46%" }}>
                            <Row
                                style={{
                                    borderBottom: "0.5px solid #4A5468",
                                }}
                            >
                                <Cell>Subtotal</Cell>
                            </Row>
                            {subtotales.subtotales?.map((subtotal) => (
                                <Row key={uuid()}>
                                    <Cell width="28vw">{subtotal.concepto}</Cell>
                                    <Cell
                                        width="18vw"
                                        textStyle={{
                                            color: "#5E6470",
                                            textAlign: "right",
                                        }}
                                    >
                                        {formatCurrency(subtotal.total || 0)}
                                    </Cell>
                                </Row>
                            ))}
                            <Row
                                style={{
                                    fontSize: 10,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    paddingRight: 14,
                                    borderTop: "1.5px solid #7C4DFF",
                                    borderBottom: "1.5px solid #7C4DFF",
                                    color: "#7241FA",
                                    fontWeight: 700,
                                }}
                            >
                                <Cell textStyle={{ width: "28vw", textAlign: "left" }}>Monto total al corte</Cell>
                                <Cell textStyle={{ width: "18vw", textAlign: "right" }}>
                                    {formatCurrency(subtotales.total || 0)}
                                </Cell>
                            </Row>
                        </Table>
                    </View>
                </View>
                <Footer />
            </Page>
        </Document>
    )
}

export default TicketResumen
