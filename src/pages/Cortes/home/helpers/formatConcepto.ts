import { capitalize } from 'src/shared/helpers/capitalize'
import { Concepto } from '../interfaces/concepto'


export const formatConcepto = (value: Concepto) => {
    if(value === "roomservice") {
        return "Room service"
    }
    return value && capitalize(value)
}
