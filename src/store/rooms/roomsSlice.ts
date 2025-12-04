import { Habitacion } from "@/gql/schema"
import { createSlice } from "@reduxjs/toolkit"

export interface RoomsState {
    rooms: Habitacion[]
}

const initialState: RoomsState = {
    rooms: [],
}

export const roomsSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        setRooms: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.rooms = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setRooms } = roomsSlice.actions

export default roomsSlice.reducer
