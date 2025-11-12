import { useState, useEffect } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Home from "./sections/Home"
import CleanStaff from "../venta/sections/CleanStaff"
import CleanType from "../venta/sections/CleanType"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import { useRoomDarwer } from "../../hooks/darwer"
import { Section } from "src/store/roomDetails/constants/sections.type"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import ChangeSupervisor from "./sections/ChangeSupervisorStaff"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function Supervision(): JSX.Element {
    const [section, setSection] = useState<Section>("home")
    const [state, setState] = useState<any>({})
    const [lockModal, setLock] = useState<boolean>(false)
    const [reportModal, setReport] = useState<boolean>(false)
    const { rolName } = useProfile()
    const { visible } = useRoomDarwer()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    useEffect(() => {
        if (visible && section !== "home") setSection("home")
    }, [visible])

    const handleNavigate = validateIsColabActive((value, state: any) => {
        setSection(value)
        if (state) setState(state)
    })

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
                    { label: "Reportar incidencia", onClick: validateIsColabActive(() => setReport(true)) },
                    { label: "Bloquear habitación", onClick: validateIsColabActive(() => setLock(true)) },
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
                    <MaintenanceType onConfirm={(reason) => {
                        setmotivoMantenimiento(reason)
                        setSection("mantenance-staff")
                    }} />
                ) : section === "change-supervisor-staff" ? <ChangeSupervisor /> : null}
            </DrawerWrapper>
            <LockRoom isOpen={lockModal} onClose={() => setLock(false)} />
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            {InactiveModal}
        </>
    )
}
export default Supervision
