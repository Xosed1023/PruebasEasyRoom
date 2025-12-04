import { configureStore } from "@reduxjs/toolkit"

import snackbarSlice from "./snackbar/snackbarSlice"
import profileSlice from "./profile/profileSlice"
import roomsSlice from "./rooms/roomsSlice"

export const store = configureStore({
    reducer: {
        snackbar: snackbarSlice,
        profile: profileSlice,
        rooms: roomsSlice
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
