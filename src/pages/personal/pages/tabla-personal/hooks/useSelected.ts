import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export function useColaboradorSelected() {
    const { colaboradorSelected } = useSelector((root: RootState) => root.personal)

    const habitacion_asignada = colaboradorSelected?.ultima_tarea
        ? !colaboradorSelected?.ultima_tarea?.fecha_termino
            ? colaboradorSelected?.ultima_tarea?.habitacion?.numero_habitacion
            : null
        : null

    return {
        colaboradorSelected: {
            ...colaboradorSelected,
            habitacion_asignada,
        },
    }
}
