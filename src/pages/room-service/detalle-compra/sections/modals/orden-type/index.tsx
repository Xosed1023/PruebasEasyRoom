import SelectModal from "src/pages/inventario/modals/SelectModal/SelectModal"
import "./index.css"

function TypeOrdenModal({ isOpen, onClose, onConfirm }): JSX.Element {
    return (
        <SelectModal
            className="type-orden__modal"
            buttonLabel="Seleccionar"
            isOpen={isOpen}
            onClose={onClose}
            title="¿Cómo quieres procesar la orden?"
            subtitle="Selecciona una de las siguientes opciones"
            onConfirm={onConfirm}
            items={[
                {
                    icon: "WaiterKitchenFilled",
                    title: "Entregar orden",
                    description: "La orden será entregada al huésped en este momento",
                    value: "entregada",
                },
                {
                    icon: "RecipeHistory",
                    title: "Preparar orden",
                    description: "La orden se enviará al módulo de preparación",
                    value: "en_preparacion",
                },
            ]}
        />
    )
}

export default TypeOrdenModal
