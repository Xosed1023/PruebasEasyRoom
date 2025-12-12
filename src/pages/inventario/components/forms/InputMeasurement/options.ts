import { UNIDAD_MEDIDAS } from "src/constants/unidadMedidas";
import { OptionMeasurement } from "./InputMeasurement.interface";

export const options: OptionMeasurement[] = UNIDAD_MEDIDAS.map(u => ({
    value: u
}))