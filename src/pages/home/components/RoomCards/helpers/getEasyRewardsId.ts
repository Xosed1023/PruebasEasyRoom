export const getEasyRewardsId = (ultimaRenta: any): string => {
    const pagos = ultimaRenta?.pagos || []
    const ordenesPago = ultimaRenta?.ordenes?.pago || []

    const easyrewardsFromPagos = pagos
        .find((pago) => pago.detalles_pago?.some((detalle) => detalle.easyrewards_id))
        ?.detalles_pago?.find((detalle) => detalle.easyrewards_id)?.easyrewards_id

    const easyrewardsFromOrdenes = ordenesPago
        .find((pago) => pago.detalles_pago?.some((detalle) => detalle.easyrewards_id))
        ?.detalles_pago?.find((detalle) => detalle.easyrewards_id)?.easyrewards_id

    return (
        easyrewardsFromPagos ||
        easyrewardsFromOrdenes ||
        ultimaRenta?.easyrewards_id ||
        ultimaRenta?.ordenes?.easyrewards_id ||
        ""
    )
}
