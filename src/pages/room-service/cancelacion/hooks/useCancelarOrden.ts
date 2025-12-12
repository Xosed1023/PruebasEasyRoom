import { CancelDetalleOrdenDetailInput, useCancelarComandaMutation, useCancelarOrdenMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useCancelarOrden = ({ mode, ordenOComandaID }: { mode: "order" | "comanda"; ordenOComandaID: string }) => {
    const { usuario_id, hotel_id } = useProfile()
    const [cancelarOrden] = useCancelarOrdenMutation()
    const [cancelarComanda] = useCancelarComandaMutation()

    const cancelarDetalles = ({
        detalles_orden,
        motivo_cancelacion,
    }: {
        detalles_orden: CancelDetalleOrdenDetailInput[]
        motivo_cancelacion: string
    }): Promise<{ ticket_id: string }> => {
        if (mode === "order") {
            return cancelarOrden({
                variables: {
                    cancel_orden_input: {
                        cancelaciones: {
                            detalles_orden,
                            motivo_cancelacion,
                        },
                        orden_id: ordenOComandaID,
                        usuario_id,
                    },
                },
            }).then((v) => ({ ticket_id: v.data?.cancelar_orden?.ticket_id || "" }))
        }
        return cancelarComanda({
            variables: {
                cancelar_comanda: {
                    cancelaciones: {
                        detalles_orden,
                        motivo_cancelacion,
                    },
                    comanda_id: ordenOComandaID,
                    hotel_id
                },
            },
        }).then((v) => ({ ticket_id: v.data?.cancelar_comanda.ticket_id || "" }))
    }

    return [cancelarDetalles]
}

export default useCancelarOrden
