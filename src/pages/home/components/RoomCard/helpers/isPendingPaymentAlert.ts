import isTimeout from "./isTimeout"

const isPendingPaymentAlert = ({
    ordenes,
    now,
}: {
    ordenes: {
        fecha_registro: string
        pago_id: string
    }[]
    now: Date
}) => {
    return ordenes.some((o) => isTimeout({ date: o.fecha_registro, now, minutes: 63 }))
}

export default isPendingPaymentAlert
