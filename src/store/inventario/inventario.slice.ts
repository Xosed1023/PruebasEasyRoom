import { createSlice } from "@reduxjs/toolkit"
import { GetAlmacenArticulosMosaicQuery } from "src/gql/schema"

export interface inventarioState {
    isInventarioDetailDrawerOpen: boolean
    isModalActivateProductFromMosaicOpen: boolean
    isModalRefillProductFromMosaicOpen: boolean
    productFormMosaicSelected?: GetAlmacenArticulosMosaicQuery["almacenes_articulos"]["almacenes_articulos"][0]
    productosMosaic?: GetAlmacenArticulosMosaicQuery["almacenes_articulos"]
}

const initialState: inventarioState = {
    isInventarioDetailDrawerOpen: false,
    isModalActivateProductFromMosaicOpen: false,
    isModalRefillProductFromMosaicOpen: false,
    productFormMosaicSelected: undefined,
    productosMosaic: undefined
}

export const inventarioSlice = createSlice({
    name: "reservations",
    initialState,
    reducers: {
        toggleInventarioDetailDrawer: (state, action: {payload: boolean}) => {
            state.isInventarioDetailDrawerOpen = action.payload
        },
        setIsModalActivateProductFromMosaicOpen: (state, action: {payload: boolean}) => {
            state.isModalActivateProductFromMosaicOpen = action.payload
        },
        setIsModalRefillProductFromMosaicOpen: (state, action: {payload: boolean}) => {
            state.isModalRefillProductFromMosaicOpen = action.payload
        },
        setProductFroMosaicSelected: (state, action) => {
            state.productFormMosaicSelected = action.payload
        },
        setProductosMosaic: (state, action) => {
            state.productosMosaic = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setIsModalActivateProductFromMosaicOpen,
    setIsModalRefillProductFromMosaicOpen,
    setProductFroMosaicSelected,
    toggleInventarioDetailDrawer,
    setProductosMosaic
} = inventarioSlice.actions

export default inventarioSlice.reducer
