import { EstadosAlmacenesArticulos, EstadosArticulo, TipoArticulo, UnidadMedidasArticulo } from "src/gql/schema"

export interface InventoryItemProps {
    isInsumo: boolean
    imgUrl?: string
    estadoArticulo: EstadosArticulo
    estadoAlmacenArticulo: EstadosAlmacenesArticulos
    article_id: string
    mediumLimit: number
    name: string
    price: number
    marca: string
    measurement: UnidadMedidasArticulo
    content: number
    units: number
    type: TipoArticulo
    onSelectItem: (id: string) => void
    onClickButton: () => void
}