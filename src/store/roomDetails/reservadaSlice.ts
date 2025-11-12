import { createSlice } from "@reduxjs/toolkit"
import { Habitacion, Reserva } from "src/gql/schema"

export type ReservadaDrawerSections = "details" | "payments" | "reasignarHabitacion" | "ConfirmarCambioHabitacion"

export interface reservationState {
    habitacionParaReasignarReservaSelected?: Habitacion
    drawerSelectedSection: ReservadaDrawerSections
    reservaSeleccionada?: Reserva
}

const initialState: reservationState = {
    reservaSeleccionada: undefined,
    drawerSelectedSection: "details",
}

export const reservationSlice = createSlice({
    name: "reservations",
    initialState,
    reducers: {
        selectReservation: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.reservaSeleccionada = action.payload
        },
        selectReservadaDrawerSection: (state, action: {payload:  ReservadaDrawerSections, type: string}) => {
            state.drawerSelectedSection = action.payload
        },
        selectRoomToReassign: (state, action) => {
            state.habitacionParaReasignarReservaSelected = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectReservation, selectReservadaDrawerSection, selectRoomToReassign } = reservationSlice.actions

export default reservationSlice.reducer
