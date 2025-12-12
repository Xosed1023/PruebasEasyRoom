import { createSlice } from "@reduxjs/toolkit"

export interface RestaurantState {
    isDrawerOpen: boolean
    loading: boolean
    mesa: any
    mesas: any[]
    auth: {
        codigo?: string
        template_sample?: string
    } | null
    tablesDimensions?: {
        x: number,
        y: number
    }
}

const initialState: RestaurantState = {
    isDrawerOpen: false,
    loading: true,
    mesa: null,
    mesas: [],
    auth: null,
}

export const navigationSlice = createSlice({
    name: "restaurant",
    initialState,
    reducers: {
        toggleRestaurantDrawer: (state, action) => {
            state.isDrawerOpen = action.payload
        },
        toggleRestaurantLoading: (state, action) => {
            state.loading = action.payload
        },
        setMesa: (state, action) => {
            state.mesa = action.payload
        },
        setOrdenMesa: (state, action) => {
            state.mesa = {
                ...state.mesa,
                asignacion_actual: {
                    ...state.mesa?.asignacion_actual,
                    orden_id: action.payload,
                },
            }
        },
        setMesas: (state, action) => {
            state.mesas = action.payload
        },
        setAuth: (
            state,
            action: {
                payload: {
                    codigo?: string
                    template_sample?: string
                } | null
            }
        ) => {
            state.auth = action.payload
        },
        setTablesDimensions: (state, action) => {
            state.tablesDimensions = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { toggleRestaurantDrawer, toggleRestaurantLoading, setMesa, setMesas, setOrdenMesa, setAuth, setTablesDimensions } =
    navigationSlice.actions

export default navigationSlice.reducer
