import { div } from "src/shared/helpers/calculator"
import { useRoom } from "."

export function useCleaningTypes() {
    const room = useRoom()
    const detail = room?.tipo_habitacion

    const getMinutes = (min: number) => {
        const minutes = min || 0
        const hour = div(minutes, 60)
        return hour === 1 ? `${hour} hora` : `${minutes} min`
    }

    return [
        {
            label: "Retoque",
            value: "retoque",
            minutes: getMinutes(detail?.minutos_limpieza_retoque),
            number_minutes: detail?.minutos_limpieza_retoque,
        },
        {
            label: "Limpieza normal",
            value: "normal",
            minutes: getMinutes(detail?.minutos_limpieza_normal),
            number_minutes: detail?.minutos_limpieza_normal,
        },
        {
            label: "Limpieza detallada",
            value: "detallada",
            minutes: getMinutes(detail?.minutos_limpieza_detallada),
            number_minutes: detail?.minutos_limpieza_detallada,
        },
    ]
}
