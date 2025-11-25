import { client } from "src/graphql"
import { useRoom } from "."
import { FREEDOM_ROOM, UPDATE_SHORT_ROOM_STATUS } from "../../graphql/mutations/rooms.mutations"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDate } from "src/shared/hooks/useDate"

export function useRoomMethods() {
    const room = useRoom()
    const { usuario_id, hotel_id } = useProfile()
    const { localDateToUTCString } = useDate()

    const updateStatus = (estado: string, params: any = {}) => {
        const actualizar_habitacion_estado_input = {
            habitacion_id: room?.habitacion_id,
            usuario_id,
            fecha_estado: localDateToUTCString(new Date()),
            estado,
            hotel_id,
            ...params,
        }

        return client.mutate({
            mutation: UPDATE_SHORT_ROOM_STATUS,
            variables: { actualizar_habitacion_estado_input },
            fetchPolicy: "no-cache",
        })
    }

    const freedomRoom = (codigo: string, estado: string, templateSample: string) => {
        const liberar_habitacion_input = {
            habitacion_id: room?.habitacion_id,
            usuario_id,
            estado,
        }
        return client.mutate({
            mutation: FREEDOM_ROOM,
            variables: { codigo, template_sample: templateSample, liberar_habitacion_input },
            fetchPolicy: "no-cache",
        })
    }

    return {
        updateStatus,
        freedomRoom,
    }
}
