import { createSlice } from "@reduxjs/toolkit"

export interface incidentsState {
    selectedIncidence: {
        folio: string
        bloquear: boolean
        habitacion: string
        estado_habitacion: string
    }
    drawerSelectedSection: "home" | "room" | "detail"
    isSnackbarCreateOpen: boolean
    selectedRoom: {
        number: number
    }
}

const initialState: incidentsState = {
    selectedIncidence: {
        folio: "",
        bloquear: false,
        habitacion: "",
        estado_habitacion: "",
    },
    drawerSelectedSection: "home",
    isSnackbarCreateOpen: false,
    selectedRoom: {
        number: 0,
    },
}

export const incidentsSlice = createSlice({
    name: "incidencias",
    initialState,
    reducers: {
        selectIncidence: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.selectedIncidence = action.payload
        },
        selectDrawerSection: (state, action) => {
            state.drawerSelectedSection = action.payload
        },

        toggleSnackBarCreate: (state, action) => {
            state.isSnackbarCreateOpen = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectIncidence, selectDrawerSection, toggleSnackBarCreate } = incidentsSlice.actions

export default incidentsSlice.reducer
