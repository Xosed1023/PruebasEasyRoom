import { createSlice } from "@reduxjs/toolkit"
import { Section } from "./constants/sections.type"

export interface maintenanceState {
    drawerSelectedSection: Section
}

const initialState: maintenanceState = {
    drawerSelectedSection: "home",
}

export const maintenanceSlice = createSlice({
    name: "maintenace",
    initialState,
    reducers: {
        selectMaintenanceSection: (state, action: {payload:  Section, type: string}) => {
            state.drawerSelectedSection = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectMaintenanceSection } = maintenanceSlice.actions

export default maintenanceSlice.reducer
