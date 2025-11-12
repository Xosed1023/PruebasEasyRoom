import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

type UseMesa = {
    nombre: string
    mesa_id: string
    estado: string
}

export function useMesa(): UseMesa & any {
    const mesa = useSelector((state: RootState) => state.restaurant.mesa)

    return {
        ...mesa,
        nombre: `Mesa${` ${mesa?.numero_mesa || ""}`}`,
        mesa_id: mesa?.mesa_id || "",
        estado: mesa?.estado || "",
    }
}
