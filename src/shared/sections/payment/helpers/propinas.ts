import { TiposPagos } from "src/gql/schema"
import { DetallePago } from "../types/pagos"
import { PropinaItem } from "../types/propinas"

interface DetallePagoPropina extends DetallePago {
    numero_referencia: string | null
}

export function getPropinaList(detalles_pago: DetallePago[], propinas: PropinaItem[]): DetallePagoPropina[] {
    const clearList = propinas.filter((p) => p && p?.id && p?.value > 0)
    return clearList.filter(p => p).map((p) => {
        const find = detalles_pago.find((_, index) => p?.id === `${index}`)
        const ultimos_digitos =  find?.ultimos_digitos || ""

        return {
            subtotal: Number(Number(p?.value || 0).toFixed(2)),
            tipo_pago: (find?.tipo_pago || "") as TiposPagos,
            ultimos_digitos:  ultimos_digitos && ultimos_digitos.length  <= 4 ? ultimos_digitos  : null,
            numero_referencia: ultimos_digitos.length  > 4 ? ultimos_digitos : null,
            easyrewards_id: find?.easyrewards_id || null,
        }
    })
}