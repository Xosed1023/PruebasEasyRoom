export const getName = (obj: any): string => {
    return `${obj?.nombre || ""} ${obj?.apellido_paterno || ""} ${obj?.apellido_materno || ""}`
}
