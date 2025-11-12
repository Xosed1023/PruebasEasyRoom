import { createSlice } from "@reduxjs/toolkit"
import { Configurations, ListenMyColaboradorSubscription, Usuario } from "src/gql/schema"

export interface ProfileState {
    myProfile: Usuario
    hotel_id: string
    nombre_hotel: string
    logo_hotel: string
    zona_horaria: string
    usuario_id: string
    turno_id: string
    rolName: string
    colaborador?: ListenMyColaboradorSubscription["checkColaborador"]
    estatus: string
    configurations?: Configurations
    hoteles: any[]
}
const myProfile = JSON.parse(localStorage.getItem("myProfile") || "{}")
const storedHotelId = sessionStorage.getItem("hotel_id")

const resolveActiveHotel = () => {
    //hotel en sessionStorage, si no, toma el primero del perfil
    const active = myProfile?.hotel?.find((h: any) => h.hotel_id === storedHotelId)
    return active || myProfile?.hotel?.[0]
}

const activeHotel = resolveActiveHotel()

const initialState: ProfileState = {
    myProfile: JSON.parse(localStorage.getItem("myProfile") || "{}"),
    hotel_id: activeHotel?.hotel_id || "",
    nombre_hotel: activeHotel?.nombre_hotel || "",
    logo_hotel: activeHotel?.logo_hotel || "",
    zona_horaria: activeHotel?.zona_horaria || "",
    usuario_id: JSON.parse(localStorage.getItem("myProfile") || "{}")?.usuario_id,
    turno_id: JSON.parse(localStorage.getItem("myProfile") || "{}")?.turno?.turno_id,
    rolName: JSON.parse(localStorage.getItem("myProfile") || "{}")?.roles?.[0]?.nombre,
    estatus: JSON.parse(localStorage.getItem("myProfile") || "{}")?.estatus,
    configurations: activeHotel?.configurations || [],
    hoteles: myProfile?.hotel || [],
}

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setMyProfile: (state, action) => {
            const active =
                action.payload?.hotel?.find((h: any) => h.hotel_id === storedHotelId) || action.payload?.hotel?.[0]
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.myProfile = action.payload
            state.hotel_id = active?.hotel_id || ""
            state.nombre_hotel = active?.nombre_hotel || ""
            state.logo_hotel = active?.logo_hotel || ""
            state.zona_horaria = active?.zona_horaria || ""
            state.usuario_id = action.payload?.usuario_id
            state.turno_id = action.payload?.turno?.turno_id
            state.rolName = action.payload?.roles?.[0]?.nombre
            state.estatus = action.payload?.estatus
            state.configurations = active?.configurations || []
            state.colaborador = action.payload?.colaborador
            state.hoteles = action.payload?.hotel || []
        },
        setChangeHotel: (state, action) => {
            const active = state.hoteles?.find((h: any) => h.hotel_id === action.payload) || myProfile?.hotel?.[0]

            state.hotel_id = active?.hotel_id || ""
            state.nombre_hotel = active?.nombre_hotel || ""
            state.logo_hotel = active?.logo_hotel || ""
            state.zona_horaria = active?.zona_horaria || ""
            state.configurations = active?.configurations || []
        },
    },
})

// Action creators are generated for each case reducer function
export const { setMyProfile, setChangeHotel } = profileSlice.actions

export default profileSlice.reducer
