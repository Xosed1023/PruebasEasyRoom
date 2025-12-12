import React from "react"
import { useNavigate } from "react-router-dom"
import SelectModal from "src/pages/inventario/modals/SelectModal/SelectModal"

const SelectProcessRecipeModal = ({
    isModalSelectOpen,
    setisModalSelectOpen,
}: {
    isModalSelectOpen: boolean
    setisModalSelectOpen: (v: boolean) => void
}) => {
    const navigate = useNavigate()

    const onConfirmSelect = (v: string) => {
        if (v === "recipe") {
            navigate("/u/inventario/receta/agregar")
        }
        if (v === "process") {
            navigate("/u/inventario/proceso/agregar")
        }
    }

    return (
        <SelectModal
            isOpen={isModalSelectOpen}
            buttonLabel="Seleccionar"
            items={[
                {
                    icon: "FoodAndDrink",
                    title: "Receta",
                    value: "recipe",
                    description: "Mezcla de ingredientes para la creación de platillos para la venta en room service.",
                },
                {
                    icon: "RecipeHistory",
                    title: "Proceso",
                    value: "process",
                    description: "Producción de insumos para la elaboración de recetas",
                },
            ]}
            startValue=""
            onClose={() => setisModalSelectOpen(false)}
            onConfirm={(v) => onConfirmSelect(v)}
        />
    )
}

export default SelectProcessRecipeModal
