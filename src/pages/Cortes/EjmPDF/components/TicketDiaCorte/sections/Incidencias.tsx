import Table from "../../PDFTable/Table/Table"
import Row from "../../PDFTable/Row/Row"
import Cell from "../../PDFTable/Cell/Cell"
import { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"

const Incidencias = ({ cortes_pdf, corte }) => {
    const [incidencias, setIncidencias] = useState<any>([])

    function tablaIncidencias(datos) {
        const conteoSeveridad = {
            habitaciones: { alta: 0, media: 0, baja: 0 },
            instalaciones: { alta: 0, media: 0, baja: 0 },
            huesped: { alta: 0, media: 0, baja: 0 },
        }

        datos.forEach((incidencia: any) => {
            if (incidencia.area === "habitación") {
                conteoSeveridad.habitaciones[incidencia.severidad]++
            } else if (incidencia.area === "instalaciones") {
                conteoSeveridad.instalaciones[incidencia.severidad]++
            } else if (incidencia.area === "huésped") {
                conteoSeveridad.huesped[incidencia.severidad]++
            }
        })

        const tabla = [
            {
                nombre: "Instalaciones",
                baja: conteoSeveridad.instalaciones.baja,
                media: conteoSeveridad.instalaciones.media,
                alta: conteoSeveridad.instalaciones.alta,
                total:
                    conteoSeveridad.instalaciones.alta +
                    conteoSeveridad.instalaciones.media +
                    conteoSeveridad.instalaciones.baja,
            },
            {
                nombre: "Habitaciones",
                baja: conteoSeveridad.habitaciones.baja,
                media: conteoSeveridad.habitaciones.media,
                alta: conteoSeveridad.habitaciones.alta,
                total:
                    conteoSeveridad.habitaciones.alta +
                    conteoSeveridad.habitaciones.media +
                    conteoSeveridad.habitaciones.baja,
            },
            {
                nombre: "Huésped",
                baja: conteoSeveridad.huesped.baja,
                media: conteoSeveridad.huesped.media,
                alta: conteoSeveridad.huesped.alta,
                total: conteoSeveridad.huesped.alta + conteoSeveridad.huesped.media + conteoSeveridad.huesped.baja,
            },
        ]
        return tabla
    }

    useEffect(() => {
        const dataTablaInc = tablaIncidencias(cortes_pdf.incidencias)
        setIncidencias(dataTablaInc)
    }, [corte])

    return (
        <Table
            style={{
                marginTop: "10px",
                border: "0.5px solid var(--placeholder)",
                transform: "scale(1.0)", // Reduce el tamaño del contenido si es necesario
                transformOrigin: "top", // Ajusta desde la parte superior
                marginBottom: 20, // Espacio suficiente para que el footer no solape
            }}
        >
            <Row backgroundColor="#eaecf0" style={{ display: "flex", justifyContent: "space-between" }}>
                <Cell textStyle={{ fontSize: 8 }}>Incidencias</Cell>
                <Cell textStyle={{ fontSize: 8, textAlign: "right" }}>Baja</Cell>
                <Cell textStyle={{ fontSize: 8, textAlign: "right" }}>Media</Cell>
                <Cell textStyle={{ fontSize: 8, textAlign: "right" }}>Alta</Cell>
                <Cell textStyle={{ fontSize: 8, textAlign: "right" }}>Total</Cell>
            </Row>
            {incidencias?.map((incidencia, index) => (
                <Row
                    style={{ display: "flex", justifyContent: "space-between" }}
                    backgroundColor={index % 2 !== 0 ? "#f2f4f7" : ""}
                    key={uuid()}
                >
                    <Cell width="20%" textStyle={{ fontSize: 7 }}>
                        {incidencia.nombre}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {incidencia.baja}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {incidencia.media}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {incidencia.alta}
                    </Cell>
                    <Cell width="20%" textStyle={{ fontSize: 7, textAlign: "right" }}>
                        {incidencia.total}
                    </Cell>
                </Row>
            ))}
            <Row
                style={{
                    borderTop: "1px solid #e3e3e3",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Cell textStyle={{ fontSize: 7 }}>Total</Cell>
                <Cell textStyle={{ fontSize: 7, textAlign: "right" }}>{cortes_pdf?.incidencias.length}</Cell>
            </Row>
        </Table>
    )
}

export default Incidencias
