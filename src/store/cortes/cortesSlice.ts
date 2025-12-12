import { createSlice } from "@reduxjs/toolkit"
import { Movimiento } from "src/pages/Cortes/home/interfaces/MovimientosCorte"

export interface cortesState {
    efectivo_ingresado: number
    movimientos: Movimiento[]
    incidencias: number
    total: number
}

const initialState: cortesState = {
    efectivo_ingresado: Number(localStorage.getItem("efectivoIngresado") || 0),
    movimientos: [],
    incidencias: 0,
    total: 0,
}

export const cortesSlice = createSlice({
    name: "cortes",
    initialState,
    reducers: {
        setEfectivoIngresado: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.efectivo_ingresado = action.payload
        },
        setMovimientos: (state, action) => {
            state.movimientos = action.payload
        },
        setIncidencias: (state, action) => {
            state.incidencias = action.payload
        },
        setTotal: (state, action) => {
            state.total = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setEfectivoIngresado, setIncidencias, setMovimientos, setTotal } = cortesSlice.actions

export default cortesSlice.reducer
