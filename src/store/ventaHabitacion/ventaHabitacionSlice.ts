import { createSlice } from "@reduxjs/toolkit"
import { Tarifa } from "src/gql/schema"

export interface ventaHabitacionState {
    isModalPagoMixtoOpen: boolean,
    isModalPagoMixtoEdited: boolean,
    tarifaSeleccionada?: Tarifa,
    tarifas: Tarifa[]
    total: number
}

const initialState: ventaHabitacionState = {
    isModalPagoMixtoOpen: false,
    isModalPagoMixtoEdited: false,
    total: 0,
    tarifas: []
}

export const ventaHabitacionSlice = createSlice({
    name: "ventaHabitacion",
    initialState,
    reducers: {
        toggleModalPagoMixtoOpen: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.isModalPagoMixtoOpen = action.payload
        },
        toggleModalPagoMixtoEdited: (state, action) => {
            state.isModalPagoMixtoEdited = action.payload
        },
        selectTarifa: (state, action) => {
            state.tarifaSeleccionada = action.payload
        },
        setTarifas: (state, action) => {
            state.tarifas = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { toggleModalPagoMixtoOpen, toggleModalPagoMixtoEdited, selectTarifa, setTarifas } = ventaHabitacionSlice.actions

export default ventaHabitacionSlice.reducer
