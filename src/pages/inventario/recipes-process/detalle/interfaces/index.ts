import { AlmacenArticulo } from "src/gql/schema"

export type DetalleRecetaProps = {
    almacenArticulo?: AlmacenArticulo
    onClose: () => void
    isOpen: boolean
    onConfirmChange: () => void
    fromInventario?: boolean
    deactivateType: any
    activateType: any
    resetSearch?: () => void
}