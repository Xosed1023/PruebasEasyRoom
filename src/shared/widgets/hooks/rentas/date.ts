export const getDateParams = () => {
    const date = new Date()
    return {
        fecha_inicial: new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(),
        fecha_final: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 59).toISOString(),
    }
}

//month
//fecha_inicial: new Date(date.getFullYear(), date.getMonth()).toISOString(),
//fecha_final: new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString(),
