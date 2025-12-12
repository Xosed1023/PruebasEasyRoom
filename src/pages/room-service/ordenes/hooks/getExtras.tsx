export const getExtras = (order, index) => {
    return order?.orden?.detalles_orden?.[index]?.extras?.length > 0 || false
}