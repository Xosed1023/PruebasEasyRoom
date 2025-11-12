import { useEffect, useState } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Home from "./sections/Home"
import SupervisorStaff from "./sections/SupervisorStaff"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { selectPendienteSupervisionSection } from "src/store/roomDetails/pendienteSupervisionSlice"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import { useRoomDarwer } from "../../hooks/darwer"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function PendienteSupervision(): JSX.Element {
    const { drawerSelectedSection } = useSelector((root: RootState) => root.roomDetails.pendienteSupervision)
    const dispatch = useDispatch()
    const [lockModal, setLock] = useState<boolean>(false)
    const [reportModal, setReport] = useState<boolean>(false)
    const { rolName } = useProfile()
    const handleNavigate = (value) => dispatch(selectPendienteSupervisionSection(value))
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [motivoMantenimiento, setmotivoMantenimiento] = useState("")

    const { visible } = useRoomDarwer()
    useEffect(() => {
        if (visible && drawerSelectedSection !== "home") handleNavigate("home")
    }, [visible])

    return (
        <>
            <DrawerWrapper
                withMenu={drawerSelectedSection === "home" && rolName !== "MANTENIMIENTO"}
                withBackButton={drawerSelectedSection !== "home"}
                onBack={() => {
                    if (drawerSelectedSection === "clean-tyoe") {
                        return handleNavigate("clean-staff")
                    }
                    if (drawerSelectedSection === "clean-staff") {
                        return handleNavigate("home")
                    }
                    if (drawerSelectedSection === "mantenance-staff") {
                        return handleNavigate("mantenance-reason")
                    }
                    handleNavigate("home")
                }}
                itemsMenu={[
                    { label: "Reportar incidencia", onClick: validateIsColabActive(() => setReport(true)) },
                    { label: "Bloquear habitación", onClick: validateIsColabActive(() => setLock(true)) },
                ]}
            >
                {drawerSelectedSection === "home" ? (
                    <Home onNavigate={handleNavigate} />
                ) : drawerSelectedSection === "mantenance-staff" ? (
                    <MaintenanceStaff motivoMantenimiento={motivoMantenimiento} />
                ) : drawerSelectedSection === "mantenance-reason" ? (
                    <MaintenanceType
                        onConfirm={(reason) => {
                            setmotivoMantenimiento(reason)
                            handleNavigate("mantenance-staff")
                        }}
                    />
                ) : drawerSelectedSection === "supervisor-staff" ? (
                    <SupervisorStaff />
                ) : null}
            </DrawerWrapper>
            <LockRoom isOpen={lockModal} onClose={() => setLock(false)} />
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            {InactiveModal}
        </>
    )
}
export default PendienteSupervision
