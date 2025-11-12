import { TiposPagos } from "src/gql/schema"
import { enumToOptions } from "src/shared/hooks/enumToOptions"

export const EFECTIVO = TiposPagos.Efectivo

export const paymentMix = { label: "Mixto", value: "mixto" }

export const paymentWaiting = { label: "Pendiente", value: "pendiente" }

export const paymentTypes = enumToOptions(TiposPagos)

export const extraFields = { amount: 0, type: "", number: "" }

export const inputIconStyle = {
    color: "var(--header-dark)",
    height: 16,
    width: 16,
}
