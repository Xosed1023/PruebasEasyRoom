import { createSlice } from "@reduxjs/toolkit"

export interface ocupadaState {
    drawerSelectedInitialTab: "room_service" | null
 }

const initialState: ocupadaState = {
    drawerSelectedInitialTab: null
}

export const ocupadaSlice = createSlice({
    name: "ocupada",
    initialState,
    reducers: {
        selectSelectedInitialTab: (state, action: {payload:  "room_service" | null, type: string}) => {
            state.drawerSelectedInitialTab = action?.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectSelectedInitialTab } = ocupadaSlice.actions

export default ocupadaSlice.reducer
