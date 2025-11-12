import { minus } from "src/shared/helpers/calculator"
import { getTax } from "src/shared/sections/payment/Payment.helpers"

export const removeItems = () => {
    sessionStorage.removeItem("@selected_products")
}

export const removeSavedProducts = () => {
    const key = "@selected_products"
    if (sessionStorage.getItem(key)) sessionStorage.removeItem(key)
}

export const getExtrasDetalle = (extras: any[]) => {
    const list: any[] = []
    extras?.forEach((e) => {
        const ivaExtra = getTax(e?.cost)
        const item = {
            almacen_articulo_id: e?.id,
            cantidad: e?.number,
            costo_con_iva: e?.cost || 0,
            costo_sin_iva: minus(e?.cost, ivaExtra),
            monto_iva: ivaExtra,
        }

        list.push(item)
    })
    return list
}
