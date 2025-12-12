import React, { useState } from "react"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

import "./Table.css"
import { Control, useFieldArray } from "react-hook-form"
import { AlmacenArticuloForm, DefaultValues, ExtraDetalleOrdenItemForm } from "../../DetalleOrden"
import { HEADERS } from "./table.constants"
import { DetalleOrden } from "src/gql/schema"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import Icon from "src/shared/icons"
import ModalComment from "src/pages/room-service/productos/sections/modals/comentario/Comment"
import ModalExtrasDetalleOrden from "../ModalExtrasDetalleOrden/ModalExtrasDetalleOrden"
import { useIVA } from "src/shared/hooks/useIVA"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { ProductItemModalExtras } from "src/shared/sections/room-service/modal-extras"

const Table = ({
    control,
    detallesOrden,
    onRemove
}: {
    control: Control<DefaultValues>
    detallesOrden: AlmacenArticuloForm[]
    onRemove?: (detalle_orden_id: string) => void
}) => {
    const { fields, remove, update } = useFieldArray({ control, name: "detalles_orden" })

    const disabledRemove = fields.length <= 1

    const { getIVA, getSubtotal } = useIVA()

    const { showSnackbar } = useSnackbar()

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
                            total: (acc[cur.almacen_articulo_id].total = cur.precio || 0),
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

    const [detalleOrdenToComment, setDetalleOrdenToComment] = useState<
        { detalleOrden: AlmacenArticuloForm; index: number } | undefined
    >(undefined)
    const [detalleOrdenToAddExtras, setDetalleOrdenToAddExtras] = useState<
        { detalleOrden: AlmacenArticuloForm; index: number } | undefined
    >(undefined)

    const handleOnChangeComment = (v: string) => {
        const detalle = detalleOrdenToComment?.detalleOrden as AlmacenArticuloForm

        showSnackbar({
            text: "Comentario actualizado",
            status: "success",
            title: `Se actualizó el comentario de ${detalle.nombre}`,
        })

        update(detalleOrdenToComment?.index || 0, {
            ...detalle,
            comanda_id: detalle.comanda_id || "",
            comentarios: v || "",
        })
    }

    const handleOnChangeExtras = (v: ProductItemModalExtras[]) => {
        const detalle = detalleOrdenToAddExtras?.detalleOrden as AlmacenArticuloForm
        const index = detalleOrdenToAddExtras?.index || 0

        showSnackbar({
            text: "Extras agregados",
            status: "success",
            title: `Se agregó extra a ${detalle.nombre}`,
        })

        update(index, {
            ...detalle,
            comanda_id: detalle.comanda_id || "",
            comentarios: detalle.comentarios || "",
            extra_detalle_orden: [
                ...Object.values<ProductItemModalExtras>(
                    v.reduce((acc, cur) => {
                        return {
                            ...acc,
                            [cur.almacen_articulo_id]: acc[cur.almacen_articulo_id]
                                ? {
                                    ...cur,
                                    number: acc[cur.almacen_articulo_id] + cur.number,
                                }
                                : cur,
                        }
                    }, {})
                ).map((e) => ({
                    almacen_articulo_id: e.id,
                    categoria: e.category,
                    categoria_id: e.categoryId,
                    costo: e.cost,
                    extra_detalle_orden_id: e.extra_detalle_orden_id || "",
                    cantidad: e.number,
                    precio: e.price,
                    costo_con_iva: e.price,
                    costo_sin_iva: getSubtotal(e.price),
                    monto_iva: getIVA(e.price),
                    nombre: e.name,
                })),
            ],
        })
    }

    return (
        <div className="table-detalle-orden__wrapper">
            <ModalExtrasDetalleOrden
                selectedDetalleOrden={{
                    price: detalleOrdenToAddExtras?.detalleOrden.precio || 0,
                    category: detalleOrdenToAddExtras?.detalleOrden.categoria || "",
                    categoryId: detalleOrdenToAddExtras?.detalleOrden.categoria_id || "",
                    cost: detalleOrdenToAddExtras?.detalleOrden.costo || 0,
                    extras:
                        detalleOrdenToAddExtras?.detalleOrden.extra_detalle_orden?.map((e) => ({
                            category: e.nombre || "",
                            categoryId: e?.categoria_id || "",
                            cost: e.costo || 0,
                            id: e.almacen_articulo_id || "",
                            name: e?.nombre || "",
                            number: e.cantidad,
                            price: e.precio,
                            extra_detalle_orden_id: e.extra_detalle_orden_id || null,
                            almacen_articulo_id: e.almacen_articulo_id,
                        })) || [],
                    id: detalleOrdenToAddExtras?.detalleOrden.almacen_articulo_id || "",
                    name: detalleOrdenToAddExtras?.detalleOrden?.nombre || "",
                    number: detalleOrdenToAddExtras?.detalleOrden.cantidad || 0,
                    type: detalleOrdenToAddExtras?.detalleOrden?.tipo || "",
                    comment: detalleOrdenToAddExtras?.detalleOrden.comentarios || "",
                }}
                isOpen={!!detalleOrdenToAddExtras}
                onChange={handleOnChangeExtras}
                onClose={() => setDetalleOrdenToAddExtras(undefined)}
            />
            <ModalComment
                onClose={() => setDetalleOrdenToComment(undefined)}
                isOpen={!!detalleOrdenToComment}
                onChange={handleOnChangeComment}
                defaultValue={detalleOrdenToComment?.detalleOrden?.comentarios || ""}
                description={detalleOrdenToComment?.detalleOrden?.nombre || ""}
            />
            <p className="table-detalle-orden__title">Productos</p>
            <div className="table-detalle-orden__divider"></div>
            <div className="table-detalle-orden">
                <FlexibleTable
                    tableItems={{
                        headers: HEADERS,
                        rows: fields.map((detalle, index) => ({
                            value: [
                                {
                                    value: index + 1,
                                },
                                {
                                    value: detalle?.categoria,
                                },
                                {
                                    value: (
                                        <div className="table-cell-column">
                                            <span style={{ marginTop: "15px" }} className="table-cell-column__text__title">
                                                {detalle?.nombre}
                                            </span>
                                            {formatExtras({
                                                extras: detalle.extra_detalle_orden || [],
                                            }).map((e, index) => (
                                                <div className="table-cell-column__text" key={index}>
                                                    <Icon name="AddCircle" color="var(--tipografa)"  width={16} height={16} /> 
                                                    <span className="table-cell-column__text__text">{e.name}</span>
                                                </div>
                                            ))}
                                            <span
                                                className="table-cell-column__text-selectable"
                                                onClick={() =>
                                                    setDetalleOrdenToAddExtras({
                                                        detalleOrden: detalle,
                                                        index,
                                                    })
                                                }
                                            >
                                                Agregar extras
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    value: (
                                        <div className="table-cell-column">
                                            {detalle.cantidad || 0}
                                            {formatExtras({
                                                extras: detalle.extra_detalle_orden || [],
                                            }).map((e, index) => (
                                                <span key={index}> {e.count || 0}</span>
                                            ))}
                                        </div>
                                    ),
                                },
                                {
                                    value: (
                                        <div className="table-cell-column">
                                            {formatCurrency(detalle.precio)}
                                            {formatExtras({
                                                extras: detalle.extra_detalle_orden || [],
                                            }).map((e, index) => (
                                                <span key={index}>{formatCurrency(e.total || 0)}</span>
                                            ))}
                                        </div>
                                    ),
                                },
                                {
                                    value: (
                                        <div className="table-cell-column">
                                            {(detalle as unknown as DetalleOrden).comentarios}
                                            <span
                                                className="table-cell-column__text-selectable"
                                                onClick={() =>
                                                    setDetalleOrdenToComment({
                                                        detalleOrden: detalle,
                                                        index,
                                                    })
                                                }
                                            >
                                                {(detalle as unknown as DetalleOrden).comentarios
                                                    ? "Editar comentario"
                                                    : "Agregar comentario"}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    value: (
                                        <Icon
                                            name="trashFilled"
                                            width={20}
                                            height={20}
                                            color="var(--primary)"
                                            cursor={"pointer"}
                                            style={{opacity: !disabledRemove ? 1 : 0.5}}
                                            onClick={ !disabledRemove ? () => onRemove ? onRemove(detalle.detalle_orden_id) : remove(index) : undefined}
                                        />
                                    ),
                                },
                            ],
                        })),
                    }}
                />
            </div>
        </div>
    )
}

export default Table
