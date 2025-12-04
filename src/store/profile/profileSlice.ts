import { createSlice } from "@reduxjs/toolkit"
import { GetPerfilQuery } from "src/gql/schema"

export interface ProfileState {
    usuario: GetPerfilQuery["mi_perfil"]
    hotel: {
        hotel_id: string
        nombre_hotel: string
        logo_hotel: string
        zona_horaria: string
    }
    nombre: string
    usuario_id: string
    turno_id: string
    rol: string
    estatus: string
    foto: string
}

export const defaultState = {
    usuario: {
        usuario_id: "",
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        correo: "",
        fecha_registro: "",
        fecha_modificacion: "",
        eliminado: false,
        telefono: "",
        estatus: "",
        hotel: [],
        roles: [],
    },
    hotel: {
        hotel_id: "",
        nombre_hotel: "",
        logo_hotel: "",
        zona_horaria: "",
    },
    usuario_id: "",
    nombre: "",
    turno_id: "",
    rol: "",
    estatus: "",
    foto: "",
}

const initialState: ProfileState = JSON.parse(localStorage.getItem("@profile") || "{}") || defaultState

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.usuario = action.payload.usuario
            state.hotel = action.payload.hotel
            state.usuario_id = action.payload.usuario_id
            state.turno_id = action.payload.turno_id
            state.rol = action.payload.rol
            state.estatus = action.payload.estatus
            state.foto = action.payload.foto
        },
        setHotel: (state, action) => {
            state.hotel = action.payload
        },
        setFoto: (state, action) => {
            state.foto = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setProfile, setHotel, setFoto } = profileSlice.actions

export default profileSlice.reducer
