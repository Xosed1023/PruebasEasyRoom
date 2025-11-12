import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export function useModulos() {
    const { modulos, loading } = useSelector((state: RootState) => state.hotel)

    return {
        loading,
        ...modulos,
    }
}
