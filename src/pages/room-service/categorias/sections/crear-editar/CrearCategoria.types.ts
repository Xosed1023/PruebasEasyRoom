import { CategoriaArticulo } from "src/gql/schema"

export interface addCategoriaProps {
    visible: boolean
    onClose: () => void
    values?: CategoriaArticulo
    categoria_id?: string
}
