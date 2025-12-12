import { createSlice } from "@reduxjs/toolkit"

export interface turn {
    turno_id: string
    nombre: string
}
const initialState: turn = {
    turno_id: JSON.parse(localStorage.getItem("turno") || "{}")?.turno_id,
    nombre: JSON.parse(localStorage.getItem("turno") || "{}")?.nombre,
}

export const turnSlice = createSlice({
    name: "turno",
    initialState,
    reducers: {
        setTurn: (state, action: { payload: { turno_id: string; nombre: string } }) => {
            state.turno_id = action.payload.turno_id
            state.nombre = action.payload.nombre
        },
    },
})

// Action creators are generated for each case reducer function
export const { setTurn } = turnSlice.actions

export default turnSlice.reducer
