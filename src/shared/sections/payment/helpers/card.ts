import { formatText } from "src/shared/hooks/formatTextOpcions"
import { TiposPagos } from "src/gql/schema"

export function getCardLabel(detalle: any, isMixed = false): string {
    if (!detalle || !detalle.tipo_pago) return ""
    let last4 = detalle.ultimos_digitos || detalle.numero_referencia?.toString() || "0000"

    const tipoPago = detalle.tipo_pago

    if (tipoPago === TiposPagos.Cortesia) {
        return "Cortesía"
    }

    if (tipoPago === TiposPagos.LovePoints) {
        return `Love points *${detalle.easyrewards_id || "0000"}`
    }

    if (tipoPago === TiposPagos.Amex) {
        return isMixed ? `*${last4}` : `Amex *${last4}`
    }

    if (tipoPago === TiposPagos.VisaOMastercard) {
        return isMixed ? `*${last4}` : `Tarjeta *${last4}`
    }

    if (tipoPago === TiposPagos.Efectivo || tipoPago === TiposPagos.ConsumoInterno) {
        return formatText(tipoPago || "")
    }

    if (tipoPago === TiposPagos.DepositoOTransferencia) {
        const referencia = detalle.ultimos_digitos || detalle.numero_referencia || "0000"
        return `Dep./Transf. *${referencia}`
    }

    if (detalle.numero_referencia) {
        last4 = detalle.numero_referencia.toString().slice(-4)
        return isMixed ? `*${last4}` : `Tarjeta *${last4}`
    }

    return formatText(tipoPago || "")
}
