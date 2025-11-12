import { UseFormSetValue } from "react-hook-form"
import { Reserva, TiposAlojamientos } from "src/gql/schema"
import { DefaultValuesType } from "../VentaHabitacion"

const useSetFormStateFromReserva = ({
    setValue,
}: {
    setValue: UseFormSetValue<DefaultValuesType>,
}) => {

    const setFormState = ({reserva}: {reserva?: Reserva}) => {
        if (!reserva) {
            return
        }
        setValue("type", reserva?.tarifa?.tipo_alojamiento || TiposAlojamientos.Hotel)
        setValue("amount", reserva.tarifa_id)   
    }

    return [setFormState]
}

export default useSetFormStateFromReserva
