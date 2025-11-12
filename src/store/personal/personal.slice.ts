import { createSlice } from "@reduxjs/toolkit"
import { Colaborador, Habitacion, HabitacionesToMaintenanceOrCleanQuery } from "src/gql/schema"

type Section = "home" | "unclean-rooms" | "cleaning-types" | "rooms-to-maintenance" | "maintenance-reason" | "rooms-to-reassign-cleaning" | "rooms-to-reassign-maintenance"

export interface personalState {
    isPersonalDrawerOpen: boolean
    isPersonalTurnoDrawerOpen: boolean
    colaboradorSelected?: Colaborador
    drawerSelectedSection?: Section
    roomToMaintenaceSelected?: HabitacionesToMaintenanceOrCleanQuery['habitaciones'][0] 
    colaboradores: Colaborador[],
    habitacionParaLimpiezaSeleccionada?: Habitacion
}

const initialState: personalState = {
    isPersonalDrawerOpen: false,
    isPersonalTurnoDrawerOpen: false,
    colaboradorSelected: undefined,
    colaboradores: [],
}

export const personalSlice = createSlice({
    name: "reservations",
    initialState,
    reducers: {
        togglePersonalDrawer: (state, action) => {
            state.isPersonalDrawerOpen = action.payload
        },
        togglePersonalTurnoDrawer: (state, action) => {
            state.isPersonalTurnoDrawerOpen = action.payload
        },
        selectColaborador: (state, action) => {
            state.colaboradorSelected = action.payload
        },
        selectRoomToMaintenace: (state, action) => {
            state.roomToMaintenaceSelected = action.payload
        },
        selectPersonalDrawerSection: (state, action: {payload: Section}) => {
            state.drawerSelectedSection = action.payload
        },
        setColaboradores: (state, action) => {
            state.colaboradores = action.payload
        },
        setHabitacionParaLimpiezaSeleccionada: (state, action: {payload?: Habitacion}) => {
            state.habitacionParaLimpiezaSeleccionada = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    togglePersonalDrawer,
    selectColaborador,
    selectPersonalDrawerSection,
    togglePersonalTurnoDrawer,
    setColaboradores,
    setHabitacionParaLimpiezaSeleccionada,
    selectRoomToMaintenace
} = personalSlice.actions

export default personalSlice.reducer
