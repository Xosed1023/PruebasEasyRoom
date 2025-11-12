import { useDispatch } from "react-redux"
import { setEfectivoIngresado } from "src/store/cortes/cortesSlice"

export function useEfectivo() {
    const dispatch = useDispatch()
    
    const onClearEfectivo = () => {
        const value = localStorage.getItem("efectivoIngresado")
        if(value) {
            dispatch(setEfectivoIngresado(0))
            localStorage.removeItem("efectivoIngresado")
            return
        }
    }

    return {
        onClearEfectivo
    }
}