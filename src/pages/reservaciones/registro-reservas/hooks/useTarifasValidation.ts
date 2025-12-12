import { useDate } from "src/shared/hooks/useDate"

const days = {
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    domingo: 0,
}

export function useTarifasValidation() {
    const { UTCStringToLocalDate } = useDate()

    const validationByDate = (tarifa: any, fecha_inicio: Date | undefined) => {
        const tarifa_fi = UTCStringToLocalDate(tarifa?.fecha_inicio)?.getTime()
        const tarifa_ff = UTCStringToLocalDate(tarifa?.fecha_final)?.getTime()

        const dayList: any[] = tarifa?.dias_disponibles?.map((d) => days?.[d]) || []

        const validDate = fecha_inicio
            ? fecha_inicio?.getTime() > tarifa_fi && fecha_inicio?.getTime() < tarifa_ff
            : false

        return validDate && dayList.includes(fecha_inicio?.getDay())
    }

    return {
        validationByDate,
    }
}
