import { UnidadConversionArticulo, UnidadMedidasArticulo } from "src/gql/schema"
import { div, times } from "src/shared/helpers/calculator"

const transformUnidadMedida = ({
    unidadesConversion = [],
    contenidoArticulo,
    costoArticulo,
    unidadDestino,
    unidadArticulo,
    unidades,
}: {
    unidadesConversion?: UnidadConversionArticulo[]
    costoArticulo: number
    contenidoArticulo: number
    unidades: number
    unidadDestino: UnidadMedidasArticulo
    unidadArticulo: UnidadMedidasArticulo
}) => {
    // ejemplo bacardi 750ml -> devolvera el costo de 1ml
    const costoUnitario = div(costoArticulo, contenidoArticulo)
    // Obtener el factor de conversion del articulo
    const factorConversion = unidadesConversion.find(
        (u) => u.unidad_destino === unidadArticulo && u.unidad_origen === unidadDestino
    )?.factor_conversion

    // obtener el peso de la cantidad elegida en la unidad seleccionada
    const pesoTransformado = times(unidades, factorConversion || 1)
    // regresar el costo para la cantidad elegida en la unida seleccionada
    const costoTransformado = times(costoUnitario, pesoTransformado)
    return costoTransformado
}

export default transformUnidadMedida
