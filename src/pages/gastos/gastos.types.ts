export interface GastosProps {
    idCortes: number
    nombreCortes: string
    categorias: string[]
    Monto: number
    MetodoDePago: string
    Comentarios?: string
    Responsable: string
    FechaDeGasto: Date
    FechaDeRegistro: Date
}
