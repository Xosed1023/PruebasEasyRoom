import ModalExtras, { Product, ProductItemModalExtras } from "src/shared/sections/room-service/modal-extras"

const ModalExtrasDetalleOrden = ({
    selectedDetalleOrden,
    isOpen,
    onChange,
    onClose,
}: {
    selectedDetalleOrden: Product
    isOpen: boolean
    onChange: (v: ProductItemModalExtras[]) => void
    onClose: () => void
}) => {
    return isOpen ? (
        <ModalExtras onClose={onClose} isOpen={true} onChange={onChange} product={selectedDetalleOrden} />
    ) : null
}

export default ModalExtrasDetalleOrden
