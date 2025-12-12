import { useFormContext, useWatch } from "react-hook-form"
import { ExtForm } from "../ModalMixto.types"

export const usePropinaTotal = () => {
    const { control } = useFormContext<ExtForm>()
    const propinas = useWatch({ control, name: "propinas" })

    return propinas?.reduce((acum, item) => (acum += item?.value || 0), 0) || 0
}