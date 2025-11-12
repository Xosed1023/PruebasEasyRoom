import { useDescontarSaldoEasyrewardsMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"

const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()
const { showSnackbar } = useSnackbar()
/**funcion aplicar mutacion descuento de lovePoints */
export const disccountLovePoints = async (
    ticket_id: string,
    easyrewards_id: string,
    puntos_descontar: number,
    hotel_id: string
): Promise<number | null> => {
    try {
        const response = await descontarSaldoEasyrewards({
            variables: {
                easyrewards_id,
                puntos_descontar,
                folio_ticket: ticket_id,
                hotel_id,
            },
        })

        if (response.data?.descuenta_puntos?.saldo !== undefined && response.data?.descuenta_puntos?.saldo !== null) {
            return response.data.descuenta_puntos.saldo
        }
        showSnackbar({
            title: "Error al descontar puntos",
            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            status: "error",
        })
        return null
    } catch (err) {
        showSnackbar({
            title: "Error al descontar puntos",
            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            status: "error",
        })
        return Promise.reject(err)
    }
}
