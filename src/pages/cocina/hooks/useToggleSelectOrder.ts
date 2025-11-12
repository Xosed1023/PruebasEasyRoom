import { useDispatch } from "react-redux"
import { DetalleOrden, Orden } from "src/gql/schema"
import {
    ActionState,
    setArticuloEstado,
    setArticuloSelected,
    setFilter,
    setIsModalAuthCocinaOpen,
    setOrdenEstado,
    setArticulosOrdenSelected,
    setAction,
    setArticulosLiberarSelected,
} from "src/store/cocina/cocinaSlice"

const useToggleSelectOrder = () => {
    const dispatch = useDispatch()

    const selectOrden = ({
        order,
        filter,
        state,
        articulos,
        action,
    }: {
        order: Orden,
        articulos: DetalleOrden[]
        filter: string[]
        state: string
        action: ActionState
    }) => {
        dispatch(setArticulosOrdenSelected({
            articulos,
            orden: order
        }))
        dispatch(setAction(action))
        dispatch(setArticuloSelected(undefined))
        dispatch(setIsModalAuthCocinaOpen(true))
        dispatch(setFilter(filter))
        dispatch(setOrdenEstado(state))
    }

    const selectArticulosLiberar = ({
        order,
        articulos,
        comanda_id,
    }: {
        order: Orden
        articulos: DetalleOrden[]
        comanda_id: string
    }) => {
        dispatch(setAction("liberar"))
        dispatch(
            setArticulosLiberarSelected({
                articulos,
                orden: order,
                comanda_id,
            })
        )
        dispatch(setIsModalAuthCocinaOpen(true))
    }

    const selectArticuloOrden = ({
        order,
        articulo,
        comanda_id,
        estado,
        action,
    }: {
        order: string
        articulo: DetalleOrden
        comanda_id: string
        estado: string
        action: ActionState
    }) => {
        dispatch(
            setArticuloSelected({
                articulo,
                orden: order,
                comanda_id,
            })
        )
        dispatch(setAction(action))
        dispatch(setArticuloEstado(estado))
        dispatch(setArticulosOrdenSelected(undefined))
        dispatch(setIsModalAuthCocinaOpen(true))
    }

    const unselectAll = () => {
        dispatch(setArticuloSelected(undefined))
        dispatch(setArticulosOrdenSelected(undefined))
        dispatch(setIsModalAuthCocinaOpen(false))
        dispatch(setArticulosLiberarSelected(undefined))
        dispatch(setAction(""))
    }

    return { selectOrden, selectArticuloOrden, unselectAll, selectArticulosLiberar }
}

export default useToggleSelectOrder
