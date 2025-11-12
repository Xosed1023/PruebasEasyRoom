import { EstadosAlmacenesArticulos, EstadosArticulo } from "src/gql/schema"

export const MOSAIC_ESTADO_FILTERS: {
    label: string
    value: {
        label: string
        value: EstadosArticulo | EstadosAlmacenesArticulos | "Todos"
    }
}[] = [
    {
        label: "Todos",
        value: {
            label: "Todos",
            value: "Todos",
        },
    },
    {
        label: "Disponibles",
        value: {
            label: "Disponibles",
            value: EstadosAlmacenesArticulos.Disponible,
        }
    },
    {
        label: "Por agotarse",
        value: {
            label: "Por agotarse",
            value: EstadosAlmacenesArticulos.PorAgotarse,
        }
    },
    {
        label: "Agotado",
        value: {
            label: "Agotado",
            value: EstadosAlmacenesArticulos.Agotado,
        }
    },
    {
        label: "Desactivado",
        value: {
            label: "Desactivado",
            value: EstadosArticulo.Desactivado,
        }
    },
]

export type MosaicCategoryFilter = "Todos" | string