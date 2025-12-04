import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { setFoto, setHotel, ProfileState, setProfile, defaultState } from "@/store/profile/profileSlice"

export const useProfile = () => {
    const { usuario, hotel, usuario_id, rol, estatus, foto, nombre } = useSelector((state: RootState) => state.profile)
    const dispatch = useDispatch()

    const saveLocalStorage = (values: any) => {
        const data = JSON.parse(localStorage.getItem("@profile") || "{}")
        const profile = { ...data, ...values }
        localStorage.setItem("@profile", JSON.stringify(profile))
    }

    return {
        usuario,
        hotel_id: hotel?.hotel_id || "",
        usuario_id,
        turno_hotel_id: "",
        rol,
        nombre_turno_hotel: "",
        estatus,
        nombre_hotel: hotel?.nombre_hotel,
        zona_horaria: hotel?.zona_horaria,
        logo_hotel: hotel?.logo_hotel,
        foto,
        nombre,
        handleFoto: (foto: string) => {
            dispatch(setFoto(foto))
            saveLocalStorage({
                foto,
            })
        },
        handleHotel: (hotel: ProfileState["hotel"]) => {
            dispatch(setHotel(hotel))
            saveLocalStorage({
                hotel,
            })
        },
        handleProfile: (profile?: ProfileState) => dispatch(setProfile(profile || { ...defaultState })),
    }
}
