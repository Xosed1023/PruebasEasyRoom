import { createSlice } from "@reduxjs/toolkit"

export interface snackbarState {
    isSnackbarOpen: boolean
}

const initialState: snackbarState = {
    isSnackbarOpen: false,
}

export const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        toggleSnackbar: (state, action) => {
            state.isSnackbarOpen = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleSnackbar } = snackbarSlice.actions

export default snackbarSlice.reducer
