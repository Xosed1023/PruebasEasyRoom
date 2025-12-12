import React, { useState } from "react"

import "./FreeRoomPendienteSupervision.css"
import { useNavigate, useParams } from "react-router-dom"
import { useSelectedRoom } from "../../hooks/selected"
import { useRoomStore } from "../../hooks"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useRoomDarwer } from "../../hooks/darwer"
import Screen from "src/shared/components/layout/screen/Screen"
import LayoutFree from "../../sections/layout-free/LayoutFree"
import { Estados_Habitaciones, useCambiar_EstadoMutation } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"

const FreeRoomPendienteSupervision = () => {
    const [value, setValue] = useState<Estados_Habitaciones | "navigate">(Estados_Habitaciones.ALaVenta)
    const navigate = useNavigate()
    const { habitacion_id = "" } = useParams()
    const { usuario_id, hotel_id } = useProfile()


    const room = useSelectedRoom()
    const { handleFinish } = useRoomStore()
    const [cambiarEstado] = useCambiar_EstadoMutation()
    const { showSnackbar } = useSnackbar()
    const { localDateToUTCString } = useDate()
    const { onClose } = useRoomDarwer()

    const handleConfirm = async () => {

        if(value === "navigate") {
            navigate(`/u/venta-habitacion/${habitacion_id}`)
            return
        }

        try {
            const {data: update} = await cambiarEstado({
                variables: {
                    actualizar_habitacion_estado_input: {
                        estado: value,
                        fecha_estado: localDateToUTCString(new Date()),
                        habitacion_id,
                        usuario_id,
                        hotel_id,
                        comentario_estado: `De pendiente de supervisión a ${value}`
                    }
                }
            })
            if (update) {
                showSnackbar({
                    title: `Habitación disponible para venta`,
                    text: `La habitación **${room?.nombre}** pasó de **pendiente de supervisión** a **disponible para la venta.**`,
                    status: "success",
                })
                handleFinish(() => {
                    onClose()
                    navigate(-1)
                })
            } else {
                showSnackbar({
                    title: "Error al liberar habitación",
                    status: "error",
                })
            }
        } catch (e) {
            showSnackbar({
                title: "Error al liberar habitación",
                status: "error",
            })
        }
    }

    return (
        <Screen title={""} close onClose={() => navigate(-1)}>
            <LayoutFree
                value={value}
                title={`¿Qué deseas hacer con la habitación ${room?.numero_habitacion}?`}
                options={[
                    {
                        label: "Ponerla a la venta",
                        icon: "moneyDollarCircleLine",
                        description: "Podrás hacer el check in en la habitación en cuanto decidas venderla.",
                        key: Estados_Habitaciones.ALaVenta,
                    },
                    {
                        label: "Vender la habitación",
                        icon: "BedFilled",
                        description: "Iniciar con proceso de venta de habitación.",
                        key: "navigate",
                    },
                ]}
                onChange={(value) => setValue(value)}
                onClick={() => handleConfirm()}
            />
        </Screen>
    )
}

export default FreeRoomPendienteSupervision
