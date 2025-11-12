import { client } from "src/graphql"
import { GET_MY_PROFILE } from "src/graphql/queries/users"
import { setMyProfile } from "src/store/profile/profileSlice"
import { RootState } from "src/store/store"

export const startGetMyProfile = (): any => {
    return async (dispatch: any, getState: () => RootState) => {
        const sesion_id = sessionStorage.getItem("@sesion_id") || ""
        const { data } = await client.query({
            query: GET_MY_PROFILE,
            fetchPolicy: "no-cache",
            variables: { sesion_id },
        })
        const mi_perfil = data?.mi_perfil
        localStorage.setItem("myProfile", JSON.stringify(mi_perfil))

        if (!sessionStorage.getItem("hotel_id")) {
            const defaultHotel = mi_perfil?.hotel?.[0]?.hotel_id
            sessionStorage.setItem("hotel_id", defaultHotel)
        }

        dispatch(setMyProfile(mi_perfil))
    }
}
