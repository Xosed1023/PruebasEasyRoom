import { UseFormSetValue } from "react-hook-form"
import { add, sum, times } from "src/shared/helpers/calculator"
import { useIVA } from "src/shared/hooks/useIVA"
import { DefaultValuesType } from "../VentaHabitacion"
import { Tarifa, TiposAlojamientos } from "src/gql/schema"

const useSetCosts = ({ setValue }: { setValue: UseFormSetValue<DefaultValuesType> }) => {
    const { getIVA } = useIVA()
    const setHours = ({ tarifa }: { tarifa?: Tarifa }) => {
        setValue("costs.hours", tarifa?.costo_hora_extra || 0)
    }

    const setRoom = ({ tarifa }: { tarifa?: Tarifa }) => {
        setValue("costs.room", tarifa?.costo_habitacion || 0)
    }

    const setCostoEarlyCheckIn = ({ tarifa, isEarlyCheckIn }: { tarifa?: Tarifa; isEarlyCheckIn: boolean }) => {
        if (!isEarlyCheckIn) {
            setValue("costs.costoEarlyCheckIn", 0)
            return
        }
        setValue("costs.costoEarlyCheckIn", tarifa?.costo_early_checkin || 0)
    }

    // Se agregó una función para calcular el costo referente a hospedajes extras
    const setHospedajes = ({ tarifa, extraHospedajes }: { tarifa?: Tarifa, extraHospedajes: number }) => {
        setValue("costs.hospedajes", Number(tarifa?.costo_hospedaje_extra || 0) * extraHospedajes)
    }

    const setTax = ({
        tarifa,
        extraHours,
        extraUsers,
        roomDays,
        isEarlyCheckIn,
    }: {
        tarifa?: Tarifa
        extraHours: number
        extraUsers: number
        isEarlyCheckIn: boolean
        roomDays: number
    }) => {
        const totalHorasExtras = times(tarifa?.costo_hora_extra || 0, extraHours)
        const totalHabitacion =
            tarifa?.tipo_alojamiento === TiposAlojamientos.Hotel
                ? add(tarifa?.costo_habitacion || 0, times(tarifa?.costo_hospedaje_extra || 0, roomDays - 1))
                : times(tarifa?.costo_habitacion || 0, roomDays)
        const totalPersonasExtra = times(
            times(tarifa?.costo_persona_extra || 0, extraUsers),
            isEarlyCheckIn ? roomDays + 1 : roomDays
        )
        setValue("costs.tax", getIVA(sum([totalHorasExtras, totalHabitacion, totalPersonasExtra])))
    }

    const setTotal = ({
        tarifa,
        extraHours,
        extraUsers,
        roomDays,
        isEarlyCheckIn,
        extraHospedajes
    }: {
        tarifa?: Tarifa
        extraHours: number
        extraUsers: number
        roomDays: number
        isEarlyCheckIn: boolean
        extraHospedajes: number
    }) => {
        // Se cambió el cálculo para considerar hospedajes extras
        const totalHorasExtras = times(tarifa?.costo_hora_extra || 0, extraHours)
        const totalHospedajesExtras = times(tarifa?.costo_hospedaje_extra || 0, extraHospedajes)
        const totalHabitacion =
            tarifa?.tipo_alojamiento === TiposAlojamientos.Hotel
                ? add(tarifa?.costo_habitacion || 0, times(tarifa?.costo_hospedaje_extra || 0, roomDays - 1))
                : times(tarifa?.costo_habitacion || 0, roomDays)
        const totalPersonasExtra = times(
            times(tarifa?.costo_persona_extra || 0, extraUsers),
            isEarlyCheckIn ? roomDays + 1 : roomDays
        )
        setValue("costs.total", sum([totalHorasExtras, totalHospedajesExtras, totalHabitacion, totalPersonasExtra]))
    }

    const setGeneral = ({
        tarifa,
        extraHours,
        extraUsers,
        totalReservaPagos,
        roomDays,
        isEarlyCheckIn,
        totalCostoExperiencias,
        extraHospedajes = 0
    }: {
        tarifa?: Tarifa
        extraHours: number
        extraUsers: number
        totalReservaPagos: number
        roomDays: number
        isEarlyCheckIn: boolean
        totalCostoExperiencias: number
        extraHospedajes: number
    }) => {
        // Se cambió el cálculo para considerar hospedajes extras
        const totalHorasExtras = times(tarifa?.costo_hora_extra || 0, extraHours)
        const totalHospedajesExtras = times(tarifa?.costo_hospedaje_extra || 0, extraHospedajes)
        const totalHabitacion =
            tarifa?.tipo_alojamiento === TiposAlojamientos.Hotel
                ? add(tarifa?.costo_habitacion || 0, times(tarifa?.costo_hospedaje_extra || 0, roomDays - 1))
                : times(tarifa?.costo_habitacion || 0, roomDays)
        const totalPersonasExtra = times(
            times(tarifa?.costo_persona_extra || 0, extraUsers),
            isEarlyCheckIn ? roomDays + 1 : roomDays
        )

        setValue(
            "costs.general",
            sum([
                totalHorasExtras,
                totalHospedajesExtras,
                totalHabitacion,
                totalPersonasExtra,
                totalCostoExperiencias,
                -totalReservaPagos,
                ...(isEarlyCheckIn ? [tarifa?.costo_early_checkin || 0] : []),
            ])
        )
    }

    // // Extra users
    const setUsers = ({
        tarifa,
        extraUsers,
        roomDays,
        isEarlyCheckIn = false,
    }: {
        tarifa?: Tarifa
        extraUsers: number
        roomDays: number
        isEarlyCheckIn: boolean
    }) => {
        setValue(
            "costs.users",
            times(times(tarifa?.costo_persona_extra || 0, extraUsers), isEarlyCheckIn ? roomDays + 1 : roomDays)
        )
    }

    const updateCosts = ({
        tarifa,
        extraHours,
        extraUsers,
        totalReservaPagos,
        roomDays,
        isEarlyCheckIn,
        totalCostoExperiencias,
        extraHospedajes
    }: {
        tarifa?: Tarifa
        extraHours: number
        extraUsers: number
        totalReservaPagos: number
        roomDays: number
        isEarlyCheckIn: boolean
        totalCostoExperiencias: number
        extraHospedajes: number
    }) => {
        setRoom({ tarifa })
        setUsers({ tarifa, extraUsers, roomDays, isEarlyCheckIn })
        setHours({ tarifa })
        setTax({ extraHours, extraUsers, tarifa, roomDays, isEarlyCheckIn })
        setTotal({ extraHours, extraUsers, tarifa, roomDays, isEarlyCheckIn, extraHospedajes })
        setGeneral({ extraHours, extraUsers, tarifa, totalReservaPagos, roomDays, isEarlyCheckIn, totalCostoExperiencias, extraHospedajes })
        setCostoEarlyCheckIn({ tarifa, isEarlyCheckIn })
        setHospedajes({ tarifa, extraHospedajes })
    }

    return {
        updateCosts,
    }
}

export default useSetCosts
