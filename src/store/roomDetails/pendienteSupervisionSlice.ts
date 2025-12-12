import { createSlice } from "@reduxjs/toolkit"
import { Section } from "./constants/sections.type"

export interface pendienteSupervisionState {
    drawerSelectedSection: Section
}

const initialState: pendienteSupervisionState = {
    drawerSelectedSection: "home",
}

export const pendienteSupervisionSlice = createSlice({
    name: "pendienteSupervision",
    initialState,
    reducers: {
        selectPendienteSupervisionSection: (state, action: {payload:  Section, type: string}) => {
            state.drawerSelectedSection = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectPendienteSupervisionSection } = pendienteSupervisionSlice.actions

export default pendienteSupervisionSlice.reducer
