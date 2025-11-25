import { useState, useEffect } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Home from "./sections/Home"
import CleanStaff from "../general/sections/CleanStaff"
import CleanType from "../general/sections/CleanType"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import { useRoomDarwer } from "../../hooks/darwer"
import { Section } from "./../general/index.type"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

function Sucia(): JSX.Element {
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
                withMenu={section === "home" && rolName !== RoleNames.mantenimiento}
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
                ) : null}
            </DrawerWrapper>
            <LockRoom isOpen={lockModal} onClose={() => setLock(false)} />
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            {InactiveModal}
        </>
    )
}
export default Sucia
