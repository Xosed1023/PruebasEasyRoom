import { createSlice } from "@reduxjs/toolkit"

export interface RoomsState {
    rooms: any[]
    selectedRoom: any
    lastSelectedRoom: any 
    roomsDimensions?: {
        x: number,
        y: number
    }
}

const initialState: RoomsState = {
    rooms: [],
    selectedRoom: {},
    lastSelectedRoom: {},
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
        selectRoom: (state, action) => {
            state.selectedRoom = action.payload
            if (Object.keys(action.payload).length > 0) { 
                state.lastSelectedRoom = action.payload;
            }
        },
        selectRoomById: (state, action) => {
            const room = state.rooms.find(r => r.habitacion_id === action.payload.habitacion_id)
            if (room) {
                state.selectedRoom = room
                state.lastSelectedRoom = room 
            }
        },
        updateRoom: (state, action) => {
            state.rooms = state.rooms.map((r) => {
                if (r.habitacion_id === action.payload.habitacion_id) {
                    return { ...action.payload }
                }
                return r
            })
            state.selectedRoom = action.payload
            state.lastSelectedRoom = action.payload 
        },
        setRoomsDimensions: (state, action) => {
            state.roomsDimensions = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setRooms, selectRoom, updateRoom, selectRoomById, setRoomsDimensions } = roomsSlice.actions

export default roomsSlice.reducer
