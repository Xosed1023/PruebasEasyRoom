import { UseFormSetValue } from "react-hook-form"
import { DefaultValuesType } from "../VentaHabitacion"
import { Reserva } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { addDays } from "src/shared/helpers/addDays"

const useResetForm = ({setValue}: {setValue: UseFormSetValue<DefaultValuesType>}) => {

    const { UTCStringToLocalDate } = useDate()

    const updateResetForm = ({reserva, tarifa_id, dateRange, numero_personas = 0, isBetween12AMAndCheckOutHour}: {reserva: Reserva, tarifa_id: string, dateRange?: Date[], numero_personas?: number, isBetween12AMAndCheckOutHour: boolean}) => {
        if(tarifa_id === reserva?.tarifa_id) {
            setValue("extraUsers", reserva.personas_extras)
            setValue("name", reserva.nombre_huesped)
            setValue("users", reserva.numero_personas)

            setValue("date", [UTCStringToLocalDate(reserva.fecha_entrada), UTCStringToLocalDate(reserva.fecha_salida)])
            return
        }
        setValue("extraUsers", 0)
        setValue("extraHours", 0)
        setValue("users", numero_personas)
        // si la hora está entre las 12am y la hora de checkOut se selecciona automaticamente la fecha de hoy, caso contrario se sabe que es una renta de 1 para el siguiente o más
        if (isBetween12AMAndCheckOutHour) {
            return setValue("date", [new Date(), new Date()])
        }
        return setValue("date", [new Date(), addDays({date: new Date(), days: 1})])
    }
    
    const resetAmount = () => {
        setValue("amount", "")
    }

    return {
        updateResetForm,
        resetAmount
    }
}

export default useResetForm