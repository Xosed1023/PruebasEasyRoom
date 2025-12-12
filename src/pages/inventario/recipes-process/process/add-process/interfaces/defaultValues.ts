import { UnidadMedidasArticulo } from "src/gql/schema"

export interface DefaultValues {
    processName: string
    measurement: UnidadMedidasArticulo | ""
    photo: string | File | null
    quantity: number | null
    articles: {
        fieldId: string;
        name: { id: string; title: string } | null
        measurement: { value: string; type: UnidadMedidasArticulo } | null,
        total: number
        articleFrom: {
            costo: number
            unidad: UnidadMedidasArticulo
            id: string
            nombre: string
            contenido: number
        } | null
    }[]
}