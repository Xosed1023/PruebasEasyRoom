/* eslint-disable indent */
import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { View } from "@react-pdf/renderer"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { formatCurrencyToFixed } from "src/shared/hooks/formatCurrency"

const UtilidadCaratula = ({ caratula }) => {
    const empty = "$0.00"
    return (
        <View>
            <Table style={{ marginTop: "12px", border: "1px solid #e3e3e3" }}>
                <Row backgroundColor="#f4f6f8">
                    <Cell width="53%" textStyle={{ fontSize: 9 }}>
                        Utilidades
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        % Sobre venta
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Promedio por habitación
                    </Cell>
                </Row>
                {caratula?.utilidad?.map((categoria, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                        <Cell width="53%" textStyle={{ fontSize: 8 }}>
                            {capitalizeString(categoria?.concepto)}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.total) || empty}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {categoria?.porcentaje_sobre_venta
                                ? Number(categoria?.porcentaje_sobre_venta).toFixed(2)
                                : "0"}
                            %
                        </Cell>
                        <Cell width="17%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.promedio_habitacion) || empty}
                        </Cell>
                    </Row>
                ))}
                <Row backgroundColor={caratula?.resumen_utilidad?.utilidad?.length % 2 !== 0 ? "#f4f6f8" : ""}>
                    <Cell width="53%" textStyle={{ fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.resumen_utilidad?.totales?.utilidad?.total
                            ? formatCurrencyToFixed(caratula?.resumen_utilidad?.totales?.utilidad?.total)
                            : empty}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.resumen_utilidad?.totales?.utilidad?.porcentaje_sobre_venta
                            ? Number(caratula?.resumen_utilidad?.totales?.utilidad?.porcentaje_sobre_venta).toFixed(2)
                            : "0"}
                        %
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.resumen_utilidad?.totales?.utilidad?.promedio_habitacion
                            ? formatCurrencyToFixed(caratula?.resumen_utilidad?.totales?.utilidad?.promedio_habitacion)
                            : empty}
                    </Cell>
                </Row>
            </Table>
            <Table style={{ marginTop: "12px", border: "none" }}>
                <Row>
                    <Cell width="50%" textStyle={{ fontSize: 9, textAlign: "right" }}>
                        Utilidad o pérdida directa de operación (GOP)
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderLeft: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                    >
                        Total
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderRight: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                        }}
                    >
                        {caratula?.resumen_utilidad?.totales?.utilidad_perdida_directa_de_operacion?.total
                            ? formatCurrencyToFixed(
                                  caratula?.resumen_utilidad?.totales?.utilidad_perdida_directa_de_operacion?.total
                              )
                            : empty}
                    </Cell>
                    <Cell
                        width="25%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderLeft: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                    >
                        Porcentaje de utilidad
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderRight: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                        }}
                    >
                        {caratula?.resumen_utilidad?.totales?.utilidad_perdida_directa_de_operacion
                            ?.porcentaje_de_utilidad
                            ? Number(
                                  caratula?.resumen_utilidad?.totales?.utilidad_perdida_directa_de_operacion
                                      ?.porcentaje_de_utilidad
                              ).toFixed(2)
                            : "0"}
                        %
                    </Cell>
                </Row>
            </Table>
            **** GASTOS DE OPERACIÓN ****
            <Table style={{ marginTop: "15px", border: "1px solid #e3e3e3" }}>
                <Row backgroundColor="#f4f6f8">
                    <Cell width="53%" textStyle={{ fontSize: 9 }}>
                        Concepto
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        % Sobre venta
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Promedio por habitación
                    </Cell>
                </Row>
                {caratula?.gastos_operativos[0]?.desgloce?.map((categoria, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                        <Cell width="53%" textStyle={{ fontSize: 8 }}>
                            {capitalizeString(categoria?.concepto)}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.total) || empty}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {categoria?.porcentaje_sobre_venta
                                ? Number(categoria?.porcentaje_sobre_venta).toFixed(2)
                                : "0"}
                            %
                        </Cell>
                        <Cell width="17%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.promedio_por_habitacion) || empty}
                        </Cell>
                    </Row>
                ))}
                <Row backgroundColor={caratula?.gastos_operativos[0]?.desgloce.length % 2 !== 0 ? "#f4f6f8" : ""}>
                    <Cell width="53%" textStyle={{ fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.gastos_operativos[0]?.totales?.total
                            ? formatCurrencyToFixed(caratula?.gastos_operativos[0]?.totales?.total)
                            : empty}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.gastos_operativos[0]?.totales?.porcentaje_sobre_venta
                            ? Number(caratula?.gastos_operativos[0]?.totales?.porcentaje_sobre_venta).toFixed(2)
                            : "0"}
                        %
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.gastos_operativos[0]?.totales?.promedio_por_habitacion
                            ? formatCurrencyToFixed(caratula?.gastos_operativos[0]?.totales?.promedio_por_habitacion)
                            : empty}
                    </Cell>
                </Row>
            </Table>
            <Table style={{ marginTop: "12px", border: "none" }}>
                <Row>
                    <Cell width="50%" textStyle={{ fontSize: 9, textAlign: "right" }}>
                        Utilidad o pérdida antes de impuestos (EBITDA)
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderLeft: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                    >
                        Total
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderRight: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                        }}
                    >
                        {caratula?.gastos_operativos[0]?.totales?.conceptos_bancarios_antes_de_impuestos?.total
                            ? formatCurrencyToFixed(
                                  caratula?.gastos_operativos[0]?.totales?.conceptos_bancarios_antes_de_impuestos.total
                              )
                            : empty}
                    </Cell>
                    <Cell
                        width="25%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderLeft: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                    >
                        Porcentaje de utilidad
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderRight: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                        }}
                    >
                        {caratula?.gastos_operativos[0]?.totales?.conceptos_bancarios_antes_de_impuestos
                            ?.porcentaje_de_utilidad
                            ? Number(
                                  caratula?.gastos_operativos[0]?.totales?.conceptos_bancarios_antes_de_impuestos
                                      ?.porcentaje_de_utilidad
                              ).toFixed(2)
                            : "0"}
                        %
                    </Cell>
                </Row>
            </Table>
            {/***** UTILIDAD O PÉRDIDA NETA *****/}
            <Table style={{ marginTop: "15px", border: "1px solid #e3e3e3" }}>
                <Row backgroundColor="#f4f6f8">
                    <Cell width="53%" textStyle={{ fontSize: 9 }}>
                        Concepto
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        % Sobre venta
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Promedio por habitación
                    </Cell>
                </Row>
                {caratula?.gastos_y_obligaciones_financieras?.desgloce?.map((categoria, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                        <Cell width="53%" textStyle={{ fontSize: 8 }}>
                            {capitalizeString(categoria?.concepto)}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.total) || empty}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {categoria?.porcentaje_sobre_venta
                                ? Number(categoria?.porcentaje_sobre_venta).toFixed(2)
                                : "0"}
                            %
                        </Cell>
                        <Cell width="17%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.promedio_por_habitacion) || empty}
                        </Cell>
                    </Row>
                ))}
                <Row
                    backgroundColor={
                        caratula?.gastos_y_obligaciones_financieras?.desgloce.length % 2 !== 0 ? "#f4f6f8" : ""
                    }
                >
                    <Cell width="53%" textStyle={{ fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.gastos_y_obligaciones_financieras?.totales?.total
                            ? formatCurrencyToFixed(caratula?.gastos_y_obligaciones_financieras?.totales?.total)
                            : empty}
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.gastos_y_obligaciones_financieras?.totales?.porcentaje_sobre_venta
                            ? Number(
                                  caratula?.gastos_y_obligaciones_financieras?.totales?.porcentaje_sobre_venta
                              ).toFixed(2)
                            : "0"}
                        %
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        {caratula?.gastos_y_obligaciones_financieras?.totales?.promedio_por_habitacion
                            ? formatCurrencyToFixed(
                                  caratula?.gastos_y_obligaciones_financieras?.totales?.promedio_por_habitacion
                              )
                            : empty}
                    </Cell>
                </Row>
            </Table>
            <Table style={{ marginTop: "12px", border: "none" }}>
                <Row>
                    <Cell width="50%" textStyle={{ fontSize: 9, textAlign: "right" }}>
                        Utilidad o pérdida neta
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderLeft: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                    >
                        Total
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderRight: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                        }}
                    >
                        {caratula?.gastos_y_obligaciones_financieras?.totales?.utilidad_y_o_perdida_neta_total?.total
                            ? formatCurrencyToFixed(
                                  caratula?.gastos_y_obligaciones_financieras?.totales?.utilidad_y_o_perdida_neta_total
                                      .total
                              )
                            : empty}
                    </Cell>
                    <Cell
                        width="25%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderLeft: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                        }}
                    >
                        Porcentaje de utilidad
                    </Cell>
                    <Cell
                        width="20%"
                        backgroundColor="#f4f6f8"
                        textStyle={{
                            fontWeight: 600,
                            fontSize: 9,
                            borderRight: "1px solid #e3e3e3",
                            borderTop: "1px solid #e3e3e3",
                            borderBottom: "1px solid #e3e3e3",
                            textAlign: "right",
                        }}
                    >
                        {caratula?.gastos_y_obligaciones_financieras?.totales?.utilidad_y_o_perdida_neta_total
                            ?.porcentaje_de_utilidad
                            ? Number(
                                  caratula?.gastos_y_obligaciones_financieras?.totales?.utilidad_y_o_perdida_neta_total
                                      ?.porcentaje_de_utilidad
                              ).toFixed(2)
                            : "0"}
                        %
                    </Cell>
                </Row>
            </Table>
            {/***** DISTRIBUCIÓN DE UTILIDAD O PÉRDIDA *****/}
            <Table style={{ marginTop: "15px", border: "1px solid #e3e3e3" }}>
                <Row backgroundColor="#f4f6f8">
                    <Cell width="68%" textStyle={{ fontSize: 9 }}>
                        Distribución de utilidad o pérdida neta
                    </Cell>
                    <Cell width="15%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Total
                    </Cell>
                    <Cell width="17%" textStyle={{ fontWeight: 600, fontSize: 9 }}>
                        Porcentaje por concepto
                    </Cell>
                </Row>
                {caratula?.distribucion_de_utilidad_o_perdida_neta?.map((categoria, index) => (
                    <Row backgroundColor={index % 2 !== 0 ? "#f4f6f8" : ""} key={index}>
                        <Cell width="68%" textStyle={{ fontSize: 8 }}>
                            {capitalizeString(categoria?.concepto)}
                        </Cell>
                        <Cell width="15%" textStyle={{ fontSize: 8 }}>
                            {formatCurrencyToFixed(categoria?.total) || empty}
                        </Cell>
                        <Cell width="17%" textStyle={{ fontSize: 8 }}>
                            {categoria?.porcentaje_por_concepto
                                ? Number(categoria?.porcentaje_por_concepto).toFixed(2)
                                : "0"}
                            %
                        </Cell>
                    </Row>
                ))}
            </Table>
        </View>
    )
}

export default UtilidadCaratula
