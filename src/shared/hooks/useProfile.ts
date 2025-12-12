import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export const useProfile = () => {
    const {
        myProfile,
        hotel_id,
        usuario_id,
        rolName,
        estatus,
        nombre_hotel,
        zona_horaria,
        logo_hotel,
        configurations,
        colaborador,
        hoteles,
    } = useSelector((state: RootState) => state.profile)
    const { turno_id: turno_hotel_id, nombre: nombre_turno_hotel } = useSelector((state: RootState) => state.turn)

    return {
        myProfile,
        hotel_id,
        usuario_id,
        turno_hotel_id,
        rolName,
        nombre_turno_hotel,
        estatus,
        nombre_hotel,
        zona_horaria,
        logo_hotel,
        configurations,
        colaborador,
        hoteles,
    }
}
