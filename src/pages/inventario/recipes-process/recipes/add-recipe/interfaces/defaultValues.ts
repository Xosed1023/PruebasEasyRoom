import { UnidadMedidasArticulo } from "src/gql/schema"

export interface DefaultValues {
    recipeName: string
    measurement: UnidadMedidasArticulo | string
    photo: string | File
    category: string
    articles: {
        fieldId: string;
        name: { id: string; title: string } | null
        measurement: { value: string; type: UnidadMedidasArticulo } | null
        total: number
        articleFrom: {
            costo: number
            unidad: UnidadMedidasArticulo
            id: string
            nombre: string
            contenido: number
        } | null
    }[]
    publicPrice: number
    isExtra: boolean
    isActive?: boolean
}
