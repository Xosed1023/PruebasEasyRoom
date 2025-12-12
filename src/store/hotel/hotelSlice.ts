import { createSlice } from "@reduxjs/toolkit"

export interface hotelState {
    imas_transaccion_available: boolean
    loading: boolean
    modulos: {
        cocina: boolean
        easyRewards: boolean
        restaurante: boolean
        reserva: boolean
        gastos: boolean
    }
}

const initialState: hotelState = {
    imas_transaccion_available: true,
    loading: true,
    modulos: {
        cocina: false,
        easyRewards: false,
        restaurante: false,
        reserva: false,
        gastos: false,
    },
}

export const hotelSlice = createSlice({
    name: "cortes",
    initialState,
    reducers: {
        toggleImasStatusAvailable: (state, action) => {
            state.imas_transaccion_available = action.payload
        },
        setModulos: (state, action) => {
            state.modulos = action.payload
        },
        setHotelLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleImasStatusAvailable, setModulos, setHotelLoading } = hotelSlice.actions

export default hotelSlice.reducer
