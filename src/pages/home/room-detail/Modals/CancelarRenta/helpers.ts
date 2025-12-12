import { TiposAlojamientos, TiposExtras } from "src/gql/schema";

export const formatExtra = ({tipo_extra, tipo_hospedaje}:{tipo_extra: TiposExtras, tipo_hospedaje: TiposAlojamientos}) => {
    if (tipo_extra === TiposExtras.Hora) {
        return "Horas extra"
    }
    if (tipo_extra === TiposExtras.Persona) {
        return "Personas extra"
    }
    if (tipo_extra === TiposExtras.Hospedaje) {
        if(tipo_hospedaje === TiposAlojamientos.Motel) {
            return "Hospedajes extra"
        }
        return "Noches extra"
    }
    return ""
} 