import { createSlice } from "@reduxjs/toolkit"

export interface orderState {
    order_id: string
    devolucion: {
        productos: number
        reembolso: number
    }
}

const initialState: orderState = {
    order_id: "",
    devolucion: {
        productos: 0,
        reembolso: 0,
    },
}

export const ordersSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        selectOrder: (state, action) => {
            state.order_id = action.payload || ""
        },
        devoluciones: (state, action) => {
            state.devolucion = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { selectOrder, devoluciones } = ordersSlice.actions

export default ordersSlice.reducer
