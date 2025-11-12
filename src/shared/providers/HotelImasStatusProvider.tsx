import { ReactNode, useEffect } from "react"
import { useCloseCorteAvailableSubscription, useGetHotelStatusQuery } from "src/gql/schema"
import { useProfile } from "../hooks/useProfile"
import { useDispatch } from "react-redux"
import { setHotelLoading, setModulos, toggleImasStatusAvailable } from "src/store/hotel/hotelSlice"

const HotelImasStatusProvider = ({ children }: { children: ReactNode }) => {
    const { hotel_id } = useProfile()
    const dispatch = useDispatch()

    const { data } = useCloseCorteAvailableSubscription({
        variables: {
            hotel_id,
        },
    })

    const { data: hotelQueryData } = useGetHotelStatusQuery({
        variables: {
            hotel_id,
        },
        onCompleted: () => dispatch(setHotelLoading(false)),
    })

    const handleModulos = () => {
        const modulos = {
            cocina: false,
            easyRewards: false,
            restaurante: false,
            reserva: false
        }

        hotelQueryData?.hotel?.suscripciones?.forEach((sub) => {
            if (sub && !sub?.eliminado && sub?.estatus === "Activa") {
                sub?.modulos?.forEach((m) => {
                    if (m.nombre_modulo === "Cocina") modulos.cocina = true
                    if (m.nombre_modulo === "Easyrewards") modulos.easyRewards = true
                    if (m.nombre_modulo === "Restaurante") modulos.restaurante = true
                    if (m.nombre_modulo === "Reservas") modulos.reserva = true
                })
            }
        })

        dispatch(setModulos(modulos))
    }

    useEffect(() => {
        dispatch(toggleImasStatusAvailable(!hotelQueryData?.hotel.imas_transaccion_status))
        if (hotelQueryData) handleModulos()
    }, [hotelQueryData])

    useEffect(() => {
        // // si imas_transaccion_status es false el servicio está disponible, de lo contrario no
        dispatch(toggleImasStatusAvailable(!data?.checkHotel.imas_transaccion_status))
    }, [data])

    return children
}

export default HotelImasStatusProvider
