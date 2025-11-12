import { createSlice } from "@reduxjs/toolkit"

export interface snackbarState {
    isMiniSnackbarOpen: boolean
    isSnackbarOpen: boolean
}

const initialState: snackbarState = {
    isMiniSnackbarOpen: false,
    isSnackbarOpen: false
}

export const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        toggleMiniSnackbar: (state, action) => {
            state.isMiniSnackbarOpen = action.payload
        },
        toggleSnackbar: (state, action) => {
            state.isSnackbarOpen = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleMiniSnackbar, toggleSnackbar } =
    snackbarSlice.actions

export default snackbarSlice.reducer
