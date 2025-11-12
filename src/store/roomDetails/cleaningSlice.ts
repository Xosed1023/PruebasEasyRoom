import { createSlice } from "@reduxjs/toolkit"
import { Section } from "./constants/sections.type"

export interface cleaningState {
    drawerSelectedSection: Section
}

const initialState: cleaningState = {
    drawerSelectedSection: "home",
}

export const pendienteSupervisionSlice = createSlice({
    name: "cleaning",
    initialState,
    reducers: {
        selectCleaningSection: (state, action: {payload:  Section, type: string}) => {
            state.drawerSelectedSection = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectCleaningSection } = pendienteSupervisionSlice.actions

export default pendienteSupervisionSlice.reducer
