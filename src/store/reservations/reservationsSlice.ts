import { createSlice } from "@reduxjs/toolkit"
import { Habitacion, Reserva } from "src/gql/schema"

export interface reservationsState {
    selectedReservation?: Reserva
    drawerSelectedSection: "detail" | "rooms" | "payments" | "selectedRoomToAssignReservation"
    selectedRoom?: Habitacion
}

const initialState: reservationsState = {
    selectedReservation: undefined,
    drawerSelectedSection: "detail",
}

export const reservationsSlice = createSlice({
    name: "reservations",
    initialState,
    reducers: {
        selectReservation: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.selectedReservation = action.payload
        },
        selectDrawerSection: (state, action: {payload: "detail" | "rooms" | "payments" | "selectedRoomToAssignReservation", type: string}) => {
            state.drawerSelectedSection = action.payload
        },
        selectRoom: (state, action) => {
            state.selectedRoom = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectReservation, selectDrawerSection, selectRoom } = reservationsSlice.actions

export default reservationsSlice.reducer
