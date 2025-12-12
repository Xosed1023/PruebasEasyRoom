import { OrigenRservas } from "src/gql/schema"
import { capitalize } from "src/shared/helpers/capitalize"

export const getOrigenLabel = (origen: string): string => {
    return origen === OrigenRservas.Telefono ? "Teléfono" : origen === OrigenRservas.Recepcion ? "Recepción" : capitalize(origen)
}