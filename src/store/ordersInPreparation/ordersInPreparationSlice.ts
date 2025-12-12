import { createSlice } from "@reduxjs/toolkit"

export interface ordersInPreparationState {
    ordersInPreparation: any[]
    selectedOrderInPreparation: any
    isLoading: boolean
}

const initialState: ordersInPreparationState = {
    ordersInPreparation: [],
    selectedOrderInPreparation: {},
    isLoading: true,
}

export const ordersInPreparationSlice = createSlice({
    name: "ordersInPreparation",
    initialState,
    reducers: {
        setOrdersInPreparation: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.ordersInPreparation = action.payload
            state.isLoading = false
        },
        startLoadingOrdersInPreparation: (state) => {
            state.isLoading = true
        },
        selectOrderInPreparation: (state, action) => {
            state.selectedOrderInPreparation = action.payload
        },
        selectOrderInPreparationById: (state, action) => {
            state.selectedOrderInPreparation = state.ordersInPreparation.find(
                (r) => r.orden_id === action.payload.orden_id
            )
        },
        updateOrderInPreparation: (state, action) => {
            state.ordersInPreparation = state.ordersInPreparation.map((r) => {
                if (r.orden_id === action.payload.orden_id) {
                    return { ...action.payload }
                }
                return r
            })
            state.selectedOrderInPreparation = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setOrdersInPreparation,
    selectOrderInPreparation,
    selectOrderInPreparationById,
    updateOrderInPreparation,
    startLoadingOrdersInPreparation,
} = ordersInPreparationSlice.actions

export default ordersInPreparationSlice.reducer
