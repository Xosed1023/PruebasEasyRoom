import { createSlice } from "@reduxjs/toolkit"

export interface ordersToDeliverState {
    ordersToDeliver: any[]
    selectedOrderToDeliver: any
    isLoading: boolean
}

const initialState: ordersToDeliverState = {
    ordersToDeliver: [],
    selectedOrderToDeliver: {},
    isLoading: true,
}

export const ordersToDeliverSlice = createSlice({
    name: "ordersToDeliver",
    initialState,
    reducers: {
        setOrdersToDeliver: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.ordersToDeliver = action.payload
            state.isLoading = false
        },
        startLoadingOrdersToDeliver: (state) => {
            state.isLoading = true
        },
        selectOrderToDeliver: (state, action) => {
            state.selectedOrderToDeliver = action.payload
        },
        selectOrderToDeliverById: (state, action) => {
            state.selectedOrderToDeliver = state.ordersToDeliver.find((r) => r.orden_id === action.payload.orden_id)
        },
        updateOrderToDeliver: (state, action) => {
            state.ordersToDeliver = state.ordersToDeliver.map((r) => {
                if (r.orden_id === action.payload.orden_id) {
                    return { ...action.payload }
                }
                return r
            })
            state.selectedOrderToDeliver = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setOrdersToDeliver,
    selectOrderToDeliver,
    selectOrderToDeliverById,
    updateOrderToDeliver,
    startLoadingOrdersToDeliver,
} = ordersToDeliverSlice.actions

export default ordersToDeliverSlice.reducer
