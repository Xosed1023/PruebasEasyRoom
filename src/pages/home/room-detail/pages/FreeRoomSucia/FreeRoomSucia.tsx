import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import LayoutFree from "src/pages/home/room-detail/sections/layout-free/LayoutFree"
import { useRoomStore } from "../../hooks"
import { useSelectedRoom } from "../../hooks/selected"
import { useRoomDarwer } from "../../hooks/darwer"
import { useRoomMethods } from "../../hooks/methods"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "./FreeRoomSucia.css"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { Estados_Habitaciones, useCambiar_EstadoMutation } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"

function FreeRoomSucia(): JSX.Element {
    const [value, setValue] = useState<string>("preparada")
    const [visible, setVisible] = useState<boolean>(false)
    const navigate = useNavigate()
    const { localDateToUTCString } = useDate()
    const { usuario_id, hotel_id } = useProfile()

    const room = useSelectedRoom()
    const { handleFinish } = useRoomStore()
    const { freedomRoom } = useRoomMethods()
    const { showSnackbar } = useSnackbar()
    const { onClose } = useRoomDarwer()
    const [cambiarEstado] = useCambiar_EstadoMutation()

    const handleConfirm = async (code: string, sampleData: string) => {
        setVisible(false)
        try {
            const { data: update } = await freedomRoom(code, value, sampleData)
            if (update) {
                showSnackbar({
                    title: `Habitación ${value === "a_la_venta" ? "disponible para venta" : "preparada"}`,
                    text: `La habitación **${room?.nombre}** pasó de **sucia** a **${
                        value === "a_la_venta" ? "disponible para la venta" : "preparada"
                    }.**`,
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
            const message: string = e?.message || ""

            if (message && message.includes("No se encontro el codigo indicado")) {
                showSnackbar({
                    title: "Código incorrecto",
                    status: "error",
                })
            } else {
                showSnackbar({
                    title: "Error al liberar habitación",
                    status: "error",
                })
            }
        }
    }

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedRoles={[RoleNames.admin, RoleNames.superadmin]}
                isOpen={visible}
                onAuthFilled={(value, sampleData) => handleConfirm(value || "", sampleData || "")}
                onClose={() => setVisible(false)}
            />
        ),
        authorizedRoles: [RoleNames.recepcionista],
        isOpen: visible,
        onClose: () => setVisible(false),
    })

    const handleClick = () => {
        if (skip) {
            cambiarEstado({
                variables: {
                    actualizar_habitacion_estado_input: {
                        estado: value as Estados_Habitaciones,
                        fecha_estado: localDateToUTCString(new Date()),
                        habitacion_id: room.habitacion_id,
                        usuario_id,
                        hotel_id
                    },
                },
            })
                .then(() => {
                    showSnackbar({
                        title: `Habitación ${value === "a_la_venta" ? "disponible para venta" : "preparada"}`,
                        text: `La habitación **${room?.nombre}** pasó de **sucia** a **${
                            value === "a_la_venta" ? "disponible para la venta" : "preparada"
                        }.**`,
                        status: "success",
                    })
                    handleFinish(() => {
                        onClose()
                        navigate(-1)
                    })
                })
                .catch(() => {
                    showSnackbar({
                        title: "Error al liberar habitación",
                        status: "error",
                    })
                })
            return
        }
        setVisible(true)
    }

    return (
        <Screen title={""} close onClose={() => navigate(-1)}>
            <LayoutFree
                value={value}
                title={`¿Qué deseas hacer con la habitación ${room?.numero_habitacion}?`}
                options={[
                    {
                        label: "Preparada",
                        icon: "check",
                        description: "La habitación estará lista para su uso, pero no estará disponible para la venta.",
                        key: "preparada",
                    },
                    {
                        label: "Ponerla a la venta",
                        icon: "moneyDollarCircleLine",
                        description: "Podrás hacer el check in en la habitación en cuanto decidas venderla.",
                        key: "a_la_venta",
                    },
                ]}
                onChange={(value) => setValue(value)}
                onClick={handleClick}
            />
            {Modal}
        </Screen>
    )
}

export default FreeRoomSucia
