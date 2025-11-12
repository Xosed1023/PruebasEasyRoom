import { useEffect } from "react"
import { UseFormSetValue } from "react-hook-form"
import { DefaultValues } from "../interfaces/defaultValues"
import { EstadosArticulo, Receta, UnidadMedidasArticulo } from "src/gql/schema"
import {v4 as uuid} from 'uuid'
import { times } from "src/shared/helpers/calculator"

const useEditRecipe = ({
    setValue,
    articulo_id,
    receta,
    isDirty
}: {
    setValue: UseFormSetValue<DefaultValues>
    articulo_id?: string
    receta?: Receta
    isDirty: boolean
}) => {
    useEffect(() => {
        if (articulo_id && receta && !isDirty) {
            setValue("category", receta.articulo?.categoria_id || "")
            setValue("isExtra", !!receta.articulo?.extra)
            setValue("measurement", receta.articulo?.unidad || "")
            setValue("publicPrice", receta.articulo?.precio?.monto || 0)
            setValue("recipeName", receta.articulo?.nombre || "")
            setValue("isActive", receta.articulo?.estado === EstadosArticulo.Activado)
            setValue(
                "articles",
                receta.ingredientes_recetas?.map((i) => ({
                    fieldId: uuid(),
                    measurement: {
                        type: i.unidad,
                        value: i.cantidad + "",
                    },
                    name: { id: i.almacen_articulo_id, title: i.articulo?.nombre || "" },
                    total: times(i.articulo?.costo?.monto || 0, Number(i.cantidad || 0)),
                    articleFrom: {
                        costo: i.articulo?.costo?.monto || 0,
                        id: i.almacen_articulo_id || "",
                        nombre: i.articulo?.nombre || "",
                        unidad: i.articulo?.unidad || UnidadMedidasArticulo.Pz,
                        contenido: i.articulo?.contenido || 1
                    }
                })) || []
            )
            setValue("photo", receta.articulo?.foto || "")
        }
    }, [receta, articulo_id, isDirty])
}

export default useEditRecipe
