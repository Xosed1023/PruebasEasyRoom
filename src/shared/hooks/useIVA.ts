import { IVA } from "src/constants/payments"
import { div, times } from "../helpers/calculator"

export const useIVA = () => {
    // Obtener el IVA de un valor que ya tiene el IVA en el
    const getIVA = (value: number) => times(div(value, 1.16), IVA);

    // Obtener el Subtotal de un valor que ya tiene el IVA en el
    const getSubtotal = (value: number) => div(value, 1.16)

    return {
        getIVA,
        getSubtotal
    }
}
