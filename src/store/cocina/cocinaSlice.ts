import { createSlice } from "@reduxjs/toolkit"
import { DetalleOrden, Orden } from "src/gql/schema"

export type ActionState = "finalizar_preparacion" | "eliminar" | "liberar" | (string & {})

export interface cocinaState {
    articulosOrdenSelected?: {
        articulos: DetalleOrden[]
        orden: Orden
    }
    articuloSelected?: {
        articulo: any
        orden: string
        comanda_id: string
    }
    articulosLiberarSelected?: {
        articulos: DetalleOrden[]
        orden: Orden
        comanda_id: string
    }
    isModalAuthCocinaOpen: boolean
    filter: string
    ordenEstado: string
    articuloEstado: string
    action: ActionState
}

const initialState: cocinaState = {
    articulosOrdenSelected: undefined,
    articuloSelected: undefined,
    articulosLiberarSelected: undefined,
    isModalAuthCocinaOpen: false,
    filter: "",
    ordenEstado: "",
    articuloEstado: "",
    action: "",
}

export const cocinaSlice = createSlice({
    name: "cocina",
    initialState,
    reducers: {
        setArticulosOrdenSelected: (
            state,
            action: {
                payload: {
                    articulos: DetalleOrden[]
                    orden: Orden
                } | undefined
                type: string
            }
        ) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.articulosOrdenSelected = action.payload
        },
        setArticuloSelected: (state, action) => {
            state.articuloSelected = action.payload
        },
        setArticulosLiberarSelected: (state, action) => {
            state.articulosLiberarSelected = action.payload
        },
        setIsModalAuthCocinaOpen: (state, action) => {
            state.isModalAuthCocinaOpen = action.payload
        },
        setFilter: (state, action) => {
            state.filter = action.payload
        },
        setOrdenEstado: (state, action) => {
            state.ordenEstado = action.payload
        },
        setArticuloEstado: (state, action) => {
            state.articuloEstado = action.payload
        },
        setAction: (state, action) => {
            state.action = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setArticulosOrdenSelected,
    setArticuloSelected,
    setIsModalAuthCocinaOpen,
    setFilter,
    setOrdenEstado,
    setArticuloEstado,
    setAction,
    setArticulosLiberarSelected,
} = cocinaSlice.actions

export default cocinaSlice.reducer
