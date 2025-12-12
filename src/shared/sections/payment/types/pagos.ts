import { TiposPagos } from "src/gql/schema"

export type DetallePago = {
    subtotal: number
    tipo_pago: TiposPagos
    ultimos_digitos: string | null
    easyrewards_id: string | null
}
