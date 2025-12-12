import { useEffect } from "react"
import { UseFormSetValue } from "react-hook-form"
import { DefaultValues } from "../interfaces/defaultValues"
import { Receta, UnidadMedidasArticulo } from "src/gql/schema"
import { times } from "src/shared/helpers/calculator"
import {v4 as uuid} from 'uuid'

const useEditProcess = ({
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
            setValue("processName", receta.articulo?.nombre || "")
            setValue("measurement", receta.articulo?.unidad || "")
            setValue("quantity", receta.articulo?.contenido || 0)
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
            if (receta.articulo?.foto) {
                setValue("photo", receta.articulo?.foto)
            }
        }
    }, [receta, articulo_id, isDirty])
}

export default useEditProcess
