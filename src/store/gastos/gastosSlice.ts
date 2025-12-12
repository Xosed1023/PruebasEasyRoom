import { createSlice } from "@reduxjs/toolkit"

export interface gastosState {
    isNuevoGastoModalOpen: boolean
    isNuevaCategoriaGastoModalOpen: boolean
}

const initialState: gastosState = {
    isNuevoGastoModalOpen: false,
    isNuevaCategoriaGastoModalOpen: false,
}

export const gastosSlice = createSlice({
    name: "cortes",
    initialState,
    reducers: {
        toggleNuevoGastoModalOpen: (state, action) => {
            state.isNuevoGastoModalOpen = action.payload
        },
        toggleNuevaCategoriaGastoModalOpen: (state, action) => {
            state.isNuevaCategoriaGastoModalOpen = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleNuevoGastoModalOpen, toggleNuevaCategoriaGastoModalOpen } = gastosSlice.actions

export default gastosSlice.reducer
