import { UnidadMedidasArticulo } from "src/gql/schema"

const unidadEnumToCompleteName = ({ v }: { v: UnidadMedidasArticulo }) => {
    switch (v) {
        case UnidadMedidasArticulo.G:
            return "Gramos"
        case UnidadMedidasArticulo.Kg:
            return "Kg"
        case UnidadMedidasArticulo.L:
            return "Litros"
        case UnidadMedidasArticulo.M:
            return "Metros"
        case UnidadMedidasArticulo.Pz:
            return "Pieza"
        case UnidadMedidasArticulo.Mg:
            return "Miligramos"
        case UnidadMedidasArticulo.ML:
            return "Mililitros"
        case UnidadMedidasArticulo.Mm:
            return "Milímetros"
    }
}

export default unidadEnumToCompleteName
