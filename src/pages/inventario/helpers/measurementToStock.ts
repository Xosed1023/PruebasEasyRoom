import { TipoArticulo, UnidadMedidasArticulo } from "src/gql/schema"

const measurementToStock = (tipo?: TipoArticulo, measurement?: UnidadMedidasArticulo) => {
    switch (measurement) {
        case UnidadMedidasArticulo.L:
            if (tipo === TipoArticulo.Proceso || tipo === TipoArticulo.Receta) {
                return UnidadMedidasArticulo.L
            }
            return UnidadMedidasArticulo.Pz
        case UnidadMedidasArticulo.Kg:
            if (tipo === TipoArticulo.Proceso || tipo === TipoArticulo.Receta) {
                return UnidadMedidasArticulo.Kg
            }
            return UnidadMedidasArticulo.Pz
        default:
            return UnidadMedidasArticulo.Pz
    }
}

export default measurementToStock
