import { useState, useEffect } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import Home from "./sections/Home"
import CleanStaff from "../general/sections/CleanStaff"
import CleanType from "../general/sections/CleanType"
import Booking from "../general/sections/Booking"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import { useRoom, useRoomStore } from "../../hooks"
import { useRoomDarwer } from "../../hooks/darwer"
import { useRoomMethods } from "../../hooks/methods"
import "./index.css"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import { Section } from "src/store/roomDetails/constants/sections.type"
import { useDisponibilidadHabitacion } from "./hooks/useDisponibilidad"
import AlertaDisponibilidad from "../../Modals/AlertaDisponibilidad/AlertaDisponibilidad"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function Venta(): JSX.Element {
    const [section, setSection] = useState<Section>("home")
    const [state, setState] = useState<any>({})
    const [lockModal, setLock] = useState<boolean>(false)
    const [reportModal, setReport] = useState<boolean>(false)
    const [modalAlert, setModalAlert] = useState<boolean>(false)
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const { alerta_por_disponibilidad } = useDisponibilidadHabitacion()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { visible } = useRoomDarwer()
    const room = useRoom()
    const { handleFinish, handleUpdateRoom } = useRoomStore()
    const { updateStatus } = useRoomMethods()
    const { rolName } = useProfile()

    useEffect(() => {
        if (visible && section !== "home") setSection("home")
    }, [visible])

    const handleNavigate = validateIsColabActive((value: any, state: any) => {
        setSection(value)
        if (state) setState(state)
    })

    const handleChangeStatus = () => {
        updateStatus("preparada")
            .then(({ data }) => {
                const update = data?.actualizar_habitacion_estado
                if (update) {
                    handleUpdateRoom(update)
                    showMiniSnackbar({
                        title: "Habitación ya no disponible para la venta",
                        text: `La **habitación ${room?.numero_habitacion}** pasa de disponible para **la venta** a **preparada.**`,
                        status: "success",
                    })
                    handleFinish()
                } else {
                    showMiniSnackbar({
                        title: "Error al eliminar la habitación de la venta",
                        status: "error",
                    })
                }
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al eliminar la habitación de la venta",
                    status: "error",
                })
            })
    }

    const [motivoMantenimiento, setmotivoMantenimiento] = useState("")

    return (
        <>
            <DrawerWrapper
                withMenu={section === "home" && rolName !== "MANTENIMIENTO"}
                withBackButton={section !== "home"}
                onBack={() => {
                    if (section === "clean-tyoe") {
                        return setSection("clean-staff")
                    }
                    if (section === "clean-staff") {
                        return setSection("home")
                    }
                    if (section === "mantenance-staff") {
                        return setSection("mantenance-reason")
                    }
                    setSection("home")
                }}
                itemsMenu={[
                    { label: "Reportar incidencia", onClick: validateIsColabActive((() => setReport(true))) },
                    { label: "Quitar de la venta", onClick: validateIsColabActive(handleChangeStatus) },
                    {
                        label: "Bloquear habitación",
                        onClick: validateIsColabActive(() => (alerta_por_disponibilidad ? setModalAlert(true) : setLock(true))),
                    },
                ]}
            >
                {section === "home" ? (
                    <Home onNavigate={handleNavigate} />
                ) : section === "clean-staff" ? (
                    <CleanStaff onNavigate={handleNavigate} />
                ) : section === "clean-tyoe" ? (
                    <CleanType onNavigate={handleNavigate} state={state} />
                ) : section === "mantenance-staff" ? (
                    <MaintenanceStaff motivoMantenimiento={motivoMantenimiento} />
                ) : section === "mantenance-reason" ? (
                    <MaintenanceType
                        onConfirm={(reason) => {
                            setmotivoMantenimiento(reason)
                            setSection("mantenance-staff")
                        }}
                    />
                ) : section === "booking" ? (
                    <Booking />
                ) : null}
            </DrawerWrapper>
            <LockRoom isOpen={lockModal} onClose={() => setLock(false)} />
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            <AlertaDisponibilidad
                isOpen={modalAlert}
                onClose={() => setModalAlert(false)}
                onClick={() => {
                    setModalAlert(false)
                    setLock(true)
                }}
            />
            {InactiveModal}
        </>
    )
}
export default Venta
