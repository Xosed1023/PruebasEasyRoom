import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { client } from "src/graphql"
import { setChangeHotel } from "src/store/profile/profileSlice"
import { RootState } from "src/store/store"
import useSnackbar from "./useSnackbar"
import { useRegistrarEventoLoginMutation } from "src/gql/schema"

export function useHotelSession() {
    const [loading, setLoading] = useState<boolean>(false)
    const { hoteles, hotel_id: store_hotel_id, usuario_id } = useSelector((state: RootState) => state.profile)
    const dispatch = useDispatch()
    const [registrarEventoLogin] = useRegistrarEventoLoginMutation()

    const { showSnackbar } = useSnackbar()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const handleChangeHotel = (hotel_id: string) => {
        if (hotel_id === store_hotel_id) return

        //Actualizar Redux con el hotel activo
        const active = hoteles?.find((h) => h.hotel_id === hotel_id)
        if (active) {
            setLoading(true)

            const sesion_id = sessionStorage.getItem("@sesion_id") || ""

            registrarEventoLogin({
                variables: {
                    input: {
                        usuario_id,
                        hotel_id,
                        sesion_id,
                    },
                },
            })
                .then(() => {
                    client
                        .reFetchObservableQueries()
                        .then(() => {
                            sessionStorage.setItem("hotel_id", hotel_id)
                            dispatch(setChangeHotel(hotel_id))
                            showSnackbar({
                                title: `Cambiaste a ${active?.nombre_hotel || ""}`,
                                text: "Ahora estás viendo la **información de este hotel.**",
                                status: "success",
                            })
                            if (pathname !== "/u") {
                                navigate("/u", { replace: true })
                            }
                        })
                        .catch(() => {
                            showSnackbar({
                                title: "No se pudo cambiar de hotel",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                status: "error",
                            })
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                })
                .catch(() => {
                    setLoading(false)
                    showSnackbar({
                        title: "No se pudo cambiar de hotel",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
        } else {
            showSnackbar({
                title: "No se pudo cambiar de hotel",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
        }
    }

    return { handleChangeHotel, loading }
}
