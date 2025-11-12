import { Control, Controller, useWatch } from "react-hook-form"
import { FormValues } from "../Form.types"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"

type InputCategoryProps = {
    control: Control<FormValues, any>
    list: any[]
    categoryList: any[]
}

export function InputCategory({ control, list = [], categoryList = [] }: InputCategoryProps): JSX.Element {
    const almacen = useWatch({ control, name: "almacen_id" })
    const find = list.find((a) => a?.almacen_id === almacen)
    const options = find ? (find?.tipo_almacen === "suministro" ? find?.categorias_almacenes : categoryList) : []

    return (
        <Controller
            control={control}
            name={"categoria_id"}
            rules={{ required: true }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Dropdown
                    className="product-form__select"
                    value={value}
                    label={"Categoría en room service"}
                    placeholder={"Alimentos, bebidas, abarrotes, farmacia..."}
                    options={
                        options?.map(({ nombre = "", categoria_id = "" }) => {
                            return {
                                label: nombre,
                                value: categoria_id,
                            }
                        }) || []
                    }
                    onClick={({ value }) => onChange(value)}
                    errorHintText={error ? "Elige una categoría" : ""}
                    icon="FolderOpenFilled"
                    iconInOptions={false}
                    tooltip={{
                        title: "Categoría en Room service",
                        description:
                            "Indica en que categoría de Room Service  se visualizará el producto para su venta.",
                    }}
                />
            )}
        />
    )
}
