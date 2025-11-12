import { EstadosOrdenHistorial } from "src/gql/schema"
import { StatusRoomServiceTypes } from "./status.type"
import { Maybe } from "graphql/jsutils/Maybe"

const getStatusRoomService = ({ estado_orden, fecha_antigua_por_entregar }: { estado_orden?: Maybe<EstadosOrdenHistorial>, fecha_antigua_por_entregar?: string | null }) => {
    if(fecha_antigua_por_entregar) {
        return StatusRoomServiceTypes.PorEntregar
    }
    if(!estado_orden) {
        return StatusRoomServiceTypes.NA
    }

    return estado_orden === EstadosOrdenHistorial.EnPreparacion
        ? StatusRoomServiceTypes.EnPreparacion
        : EstadosOrdenHistorial.PorEntregar
        ? StatusRoomServiceTypes.PorEntregar
        : StatusRoomServiceTypes.NA
}

export default getStatusRoomService
