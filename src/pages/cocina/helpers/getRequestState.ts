import { EstadosComandaHistorial, EstadosOrdenHistorial, Orden } from "src/gql/schema"

export enum RequestState {
    en_preperacion = "en_preperacion",
    por_entregar = "por_entregar",
}

const getRequestState = ({ orden }: { orden: Orden }): { state: RequestState } => {
    return {
        state:
            orden?.comanda?.estado_comanda === EstadosComandaHistorial.EnPreparacion ||
            orden?.estado_orden === EstadosOrdenHistorial.EnPreparacion
                ? RequestState.en_preperacion
                : RequestState.por_entregar,
    }
}

export default getRequestState
