export const getLocalStatus = (cantidad: number, cantidad_minima: number) => {
    return cantidad > 0 ? "activado" : "desactivado"
}
