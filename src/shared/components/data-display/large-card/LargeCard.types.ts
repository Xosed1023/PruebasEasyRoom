import { DeleteCategoriaGastosInput } from "src/gql/schema"
import { ComponentProps } from "src/types/component"

export interface LargeCardProps extends ComponentProps {
    containerClassName?: string
    id: DeleteCategoriaGastosInput["categoria_id"]
    title?: string
    subtitle?: string
    gastos?: number
    presupuesto?: string
    subCategorias: {
        __typename?: "SubcategoriaGasto" | undefined
        eliminado: boolean
        subcategoria: string
        subcategoria_gasto_id: string
    }[]
    limiteMensual: string
    onEditMesaje: (value: { texto: string; success: boolean }) => void
    addSubCat?: () => void
    onSubAdd: (value: { texto: string; success: boolean }) => void
    onSubDelete: (value: { texto: string; success: boolean }) => void
    predeterminado: boolean
}
