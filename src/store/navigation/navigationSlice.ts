import { createSlice } from "@reduxjs/toolkit"

export interface navigationState {
    isDrawerOpen: boolean
    isRoomDetailsDrawerOpen: boolean
    isProfileDrawerOpen: boolean
    isDrawerWidgetOpen: boolean
    isSlidePersonalOpen: any
    isLoaderOpen: boolean
    isRSDirty: boolean
    isPromptRS: string
}

const initialState: navigationState = {
    isDrawerOpen: false,
    isRoomDetailsDrawerOpen: false,
    isProfileDrawerOpen: false,
    isDrawerWidgetOpen: false,
    isSlidePersonalOpen: null,
    isLoaderOpen: false,
    isRSDirty: false,
    isPromptRS: "",
}

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        toggleDrawer: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.isDrawerOpen = action.payload
        },
        toggleRoomDetailsDrawer: (state, action) => {
            state.isRoomDetailsDrawerOpen = action.payload
        },
        toggleProfileDrawer: (state, action) => {
            state.isProfileDrawerOpen = action.payload
            state.isDrawerOpen = false
            state.isRoomDetailsDrawerOpen = false
            state.isDrawerWidgetOpen = false
        },
        toggleDrawerWidget: (state, action) => {
            state.isDrawerWidgetOpen = action.payload
            state.isProfileDrawerOpen = false
        },
        toggleSlidePersonal: (state, action) => {
            state.isSlidePersonalOpen = action.payload
            state.isProfileDrawerOpen = false
        },
        showLoader: (state, action) => {
            state.isLoaderOpen = action.payload
        },
        toggleRSDirty: (state, action) => {
            state.isRSDirty = action.payload
        },
        togglePromptRS: (state, action) => {
            state.isPromptRS = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    toggleDrawer,
    toggleRoomDetailsDrawer,
    toggleProfileDrawer,
    toggleDrawerWidget,
    showLoader,
    toggleRSDirty,
    togglePromptRS,
    toggleSlidePersonal,
} = navigationSlice.actions

export default navigationSlice.reducer
