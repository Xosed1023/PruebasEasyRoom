import { UnidadMedidasArticulo } from "src/gql/schema"
import { Option } from "src/shared/components/forms/selelct-dropdown/Dropdown"

export const UNIDAD_MEDIDAS = [
    UnidadMedidasArticulo.G,
    UnidadMedidasArticulo.Kg,
    UnidadMedidasArticulo.L,
    UnidadMedidasArticulo.M,
    UnidadMedidasArticulo.ML,
    UnidadMedidasArticulo.Mg,
    UnidadMedidasArticulo.Mm,
    UnidadMedidasArticulo.Pz,
]

export const UNIDAD_MEDIDAS_DROPDOWN: Option[] = [
    { label: "kg (kilogramo)", value: UnidadMedidasArticulo.Kg },
    { label: "g (gramo)", value: UnidadMedidasArticulo.G },
    { label: "L (litro)", value: UnidadMedidasArticulo.L },
    { label: "mL (mililitro)", value: UnidadMedidasArticulo.ML },
    { label: "m (metro)", value: UnidadMedidasArticulo.M },
    { label: "mm (milimetro)", value: UnidadMedidasArticulo.Mm },
    { label: "pz (pieza)", value: UnidadMedidasArticulo.Pz },
]
