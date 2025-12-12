import Table from "../../../PDFTable/Table/Table"
import Row from "../../../PDFTable/Row/Row"
import Cell from "../../../PDFTable/Cell/Cell"
import { View } from "@react-pdf/renderer"
import { v4 as uuid } from "uuid"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useEffect, useState } from "react"
import { InventarioResponse, Tarjeta } from "./interfaces"
import textEllipsis from "./helpers/textEllipsis"

const Cards = ({ inventario }: { inventario?: InventarioResponse }) => {
    const [data, setData] = useState<Tarjeta[]>([])
    const [cardsPages, setcardsPages] = useState(1)

    const updateData = () => {
        const tarjetas: Tarjeta[] = [...(inventario?.tarjetas || [])]
        inventario?.tarjetas?.forEach((categoria) => {
            if (categoria?.nombre === "Insumos o amenidades") {
                categoria.nombre = "Amenities"
            }
        })
        tarjetas.sort((a, b) => a.nombre.localeCompare(b.nombre))
        return tarjetas
    }

    useEffect(() => {
        if (inventario?.tarjetas?.length || 0 > 0) {
            const updatedInventario = updateData()
            setcardsPages(Math.ceil((updatedInventario.length || 1) / 5 || 1))

            setData(updatedInventario || [])
        }
    }, [inventario])

    return (
        <View
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {Array.from({ length: cardsPages }).map((_i, pageIndex) => (
                <View style={{ width: "100%" }} key={uuid()}>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                        }}
                    >
                        {data?.map((card, cardIndex) =>
                            cardIndex + 1 > (pageIndex + 1) * 5 - 5 && cardIndex + 1 <= (pageIndex + 1) * 5 ? (
                                <Table
                                    style={{
                                        margin: "5px",
                                        backgroundColor: "#f4f6f8",
                                        borderRadius: "5px",
                                        border: "none",
                                        padding: "5px 8px",
                                    }}
                                    key={uuid()}
                                >
                                    <Row>
                                        <Cell
                                            textStyle={{
                                                fontSize: 9,
                                            }}
                                        >
                                            {textEllipsis({ text: card.nombre, limit: 16 })}
                                        </Cell>
                                    </Row>
                                    <Row>
                                        <Cell width="16%" textStyle={{ fontSize: 9 }}>
                                            {formatCurrency(Number(card.total || 0) || 0)}
                                        </Cell>
                                    </Row>
                                    <Row>
                                        <Cell width="16%" textStyle={{ fontSize: 6, textAlign: "right" }}>
                                            {card.unidades + ""} unidades
                                        </Cell>
                                    </Row>
                                </Table>
                            ) : null
                        )}
                    </View>
                </View>
            ))}
        </View>
    )
}

export default Cards
