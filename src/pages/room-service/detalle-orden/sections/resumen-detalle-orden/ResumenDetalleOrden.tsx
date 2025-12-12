import React from "react"

import { ButtonProps } from "src/shared/components/forms/button/types/button.props"
import { add, sum } from "src/shared/helpers/calculator"
import { useIVA } from "src/shared/hooks/useIVA"
import Resumen from "../resumen/Resumen"
import Header from "../resumen/header/Header"
import Body from "../resumen/body/Body"
import DetalleOrdenItem from "../resumen/body/items/detalle-orden-item/DetalleOrdenItem"
import SubBody from "../resumen/subbody/SubBody"
import DetalleOrdenItemSubBody from "../resumen/subbody/items/detalle-orden/DetalleOrdenItem"
import Footer from "../resumen/footer/Footer"
import { AlmacenArticuloForm, ExtraDetalleOrdenItemForm } from "../../DetalleOrden"

interface ResumenProps {
    title: string
    detallesOrden: AlmacenArticuloForm[]
    footerProps: ButtonProps
}

const ResumenDetalleOrden = ({ title, detallesOrden = [], footerProps }: ResumenProps) => {
    const { getIVA, getSubtotal } = useIVA()

    const filterByCategoryName = ({
        detallesOrden,
        categoryName,
    }: {
        detallesOrden: AlmacenArticuloForm[]
        categoryName: string
    }) => {
        return detallesOrden.filter((d) => d?.categoria === categoryName)
    }

    const getTotal = ({ detallesOrden }: { detallesOrden: AlmacenArticuloForm[] }) => {
        return add(
            sum(detallesOrden?.flatMap((d) => d.extra_detalle_orden?.map((e) => Number(e.precio || 0) * Number(e.cantidad || 0)) || 0) || []),
            sum(detallesOrden?.map((d) => Number(d.precio || 0) * Number(d.cantidad || 0)) || [])
        )
    }

    const formatExtras = ({
        extras,
    }: {
        extras: ExtraDetalleOrdenItemForm[]
    }): { count: number; total: number; name: string }[] => {
        return Object.values(
            extras.reduce((acc, cur) => {
                return {
                    ...acc,
                    [cur.almacen_articulo_id]: acc[cur.almacen_articulo_id]
                        ? {
                            count: (acc[cur.almacen_articulo_id].count += 1),
                            total: (acc[cur.almacen_articulo_id].total += cur.precio || 0),
                            name: cur?.nombre,
                        }
                        : {
                            count: cur.cantidad || 1,
                            total: cur.precio || 0,
                            name: cur?.nombre,
                        },
                }
            }, {})
        )
    }

    return (
        <Resumen>
            <Header title={title} />
            <Body>
                {detallesOrden.map((d, index) => (
                    <DetalleOrdenItem
                        key={index + "detalle-orden"}
                        cost={d?.costo_con_iva || 0}
                        count={d.cantidad}
                        title={d?.nombre || ""}
                        extras={formatExtras({ extras: d.extra_detalle_orden || [] })?.map((e) => ({
                            cost: e.total || 0,
                            title: e?.name || "",
                            count: e.count || 0
                        }))}
                    />
                ))}
            </Body>
            <SubBody>
                <DetalleOrdenItemSubBody
                    amount={getSubtotal(
                        getTotal({
                            detallesOrden: filterByCategoryName({ detallesOrden, categoryName: "Alimentos" }),
                        })
                    )}
                    title="Total alimentos"
                />
                <DetalleOrdenItemSubBody
                    amount={getSubtotal(
                        getTotal({
                            detallesOrden: filterByCategoryName({ detallesOrden, categoryName: "Bebidas" }),
                        })
                    )}
                    title="Total bebidas"
                />
                <DetalleOrdenItemSubBody
                    amount={getSubtotal(
                        getTotal({
                            detallesOrden: detallesOrden.filter((d) => {
                                const name = d?.categoria
                                return name !== "Alimentos" && name !== "Bebidas"
                            }),
                        })
                    )}
                    title="Total de otros"
                />
                <DetalleOrdenItemSubBody amount={getIVA(getTotal({ detallesOrden }))} bold={false} title="Impuestos" />
                <DetalleOrdenItemSubBody amount={getTotal({ detallesOrden })} big title="Total" />
            </SubBody>
            <Footer {...footerProps} />
        </Resumen>
    )
}

export default ResumenDetalleOrden

