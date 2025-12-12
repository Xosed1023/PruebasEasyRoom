import { TiposPagos } from "src/gql/schema"
import { DetallePago } from "../types/pagos"

export function getDetallesPago(array: any[]): DetallePago[] {
    return array?.map(({ type, number, amount, easyrewards_id }) => {
        return {
            subtotal: amount,
            tipo_pago: type,
            ultimos_digitos:
                type === TiposPagos.VisaOMastercard ||
                type === TiposPagos.Amex ||
                type === TiposPagos.DepositoOTransferencia
                    ? number
                    : null,
            easyrewards_id:
                type === TiposPagos.Efectivo ||
                type === TiposPagos.VisaOMastercard ||
                type === TiposPagos.Amex ||
                type === TiposPagos.DepositoOTransferencia ||
                type === TiposPagos.LovePoints
                    ? easyrewards_id
                    : null,
        }
    })
}
