export const getItemDetalle = (p: any) => {
    return {
        cantidad: p.number || 0,
        costo_con_iva: p.price,
        comentarios: p.comment || "",
        almacen_articulo_id: p.id,
        almacen_articulo: {
            almacen_articulo_id: p.id,
            articulo_id: p.id,
            precio: p.price,
            articulo: {
                nombre: p.name,
                categoria_id: p.categoryId,
                precio: { monto: p.price },
                categoria_articulo: { nombre: p.category },
            },
        },
    }
}

export const getExtrasOrden = (extras: any[], detalles_extras: any[]) => {
    return extras.map((p) => {
        const detalle = detalles_extras.find((f) => f.almacen_articulo_id === p.id)
        const item = {
            ...detalle,
            cantidad: p.number || 0,
            comentarios: p.comment || "",
        }

        const nuevo = { ...getItemDetalle(p), extra_detalle_orden_id: null }

        return detalle ? item : nuevo
    })
}

export const getArticulosFromDetalle = (detalles_orden: any[]) => {
    return detalles_orden.map((p) => {
        const a = p?.almacen_articulo?.articulo
        return {
            id: `${p?.almacen_articulo_id}__${p?.detalle_orden_id}`,
            name: a?.nombre,
            cost: p?.costo_con_iva || 0,
            price: p?.costo_con_iva || 0,
            number: p?.cantidad || 0,
            comment: p?.comentarios || "",
            categoryId: a?.categoria_id,
            category: a?.categoria_articulo?.nombre,
            type: a?.tipo,
            extra: a?.extra || false,
            detalle_orden_id: p?.detalle_orden_id || null,
            extras: p?.extras?.map((e) => {
                const art = e?.almacen_articulo?.articulo
                return {
                    id: e?.almacen_articulo_id,
                    name: art?.nombre,
                    cost: e?.costo_con_iva || 0,
                    price: e?.costo_con_iva || 0,
                    number: e?.cantidad || 0,
                    comment: e?.comentarios || "",
                    categoryId: art?.categoria_id,
                    category: art?.categoria_articulo?.nombre,
                    extra_detalle_orden_id: e.extra_detalle_orden_id || null,
                }
            }),
        }
    })
}
