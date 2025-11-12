import { UseFormSetValue } from "react-hook-form"
import { UnidadConversionArticulo, UnidadMedidasArticulo } from "src/gql/schema"
import { DefaultValues } from "../interfaces/defaultValues"
import { times } from "src/shared/helpers/calculator"
import transformUnidadMedida from "../../../helpers/transformUnidadMedida"

interface Ingrediente {
    name:
        | {
              id: string
              title: string
          }
        | null
    measurement:
        | {
              value: string
              type: UnidadMedidasArticulo
          }
        | null
    total: number
    articleFrom: {
        costo: number
        unidad: UnidadMedidasArticulo
        id: string
        nombre: string
        contenido: number
    } | null
}

const updateIngredientsStatus = ({
    ingredientes,
    setValue,
    unidadesConversionArticulo,
    isDirty
}: {
    ingredientes: Ingrediente[]
    setValue: UseFormSetValue<DefaultValues>
    unidadesConversionArticulo: UnidadConversionArticulo[]
    isDirty: boolean
}) => {
    if(!isDirty) {
        return
    }
    ingredientes.forEach(({ measurement, name, total, articleFrom }, index) => {
        if (!measurement && name) {
            return setValue(`articles.${index}.measurement`, {
                type: articleFrom?.unidad || UnidadMedidasArticulo.Pz,
                value: "",
            })
        }
        if (!name) {
            setValue(`articles.${index}.measurement`, null)
            return setValue(`articles.${index}.total`, 0)
        }
        if (
            articleFrom?.unidad === UnidadMedidasArticulo.Pz
        ) {
            return setValue(
                `articles.${index}.total`,
                times(articleFrom?.costo || 0, Number(measurement?.value || 0))
            )
        }
        setValue(
            `articles.${index}.total`,
            transformUnidadMedida({
                unidadArticulo: articleFrom?.unidad || UnidadMedidasArticulo.Pz,
                contenidoArticulo: articleFrom?.contenido || 0,
                costoArticulo: articleFrom?.costo || 0,
                unidadDestino: measurement?.type || UnidadMedidasArticulo.Pz,
                unidades: Number(measurement?.value) || 0,
                unidadesConversion: unidadesConversionArticulo,
            })
        )
    })
}

export default updateIngredientsStatus
