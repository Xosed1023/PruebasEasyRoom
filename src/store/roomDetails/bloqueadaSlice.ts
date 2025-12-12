import { createSlice } from "@reduxjs/toolkit"
import { Section } from "./constants/sections.type"

export interface bloqueadaState {
    drawerSelectedSection: Section
}

const initialState: bloqueadaState = {
    drawerSelectedSection: "home",
}

export const pendienteSupervisionSlice = createSlice({
    name: "bloqueada",
    initialState,
    reducers: {
        selectBloqueadaSection: (state, action: {payload:  Section, type: string}) => {
            state.drawerSelectedSection = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectBloqueadaSection } = pendienteSupervisionSlice.actions

export default pendienteSupervisionSlice.reducer
