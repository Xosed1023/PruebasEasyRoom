import { useEffect, useState } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Home from "./sections/home"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import "./index.css"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { selectMaintenanceSection } from "src/store/roomDetails/maintenance.Slice"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import { useRoomDarwer } from "../../hooks/darwer"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function Mantenimiento(): JSX.Element {
    const [lockModal, setLock] = useState<boolean>(false)
    const [reportModal, setReport] = useState<boolean>(false)
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const { drawerSelectedSection } = useSelector((root: RootState) => root.roomDetails.maintenance)
    const dispatch = useDispatch()
    const handleNavigate = validateIsColabActive((value, state: any) => {
        dispatch(selectMaintenanceSection(value))
    })

    const { visible } = useRoomDarwer()

    useEffect(() => {
        if (visible && drawerSelectedSection !== "home") dispatch(selectMaintenanceSection("home"))
    }, [visible])

    return (
        <>
            <DrawerWrapper
                withMenu={drawerSelectedSection === "home" && rolName !== "MANTENIMIENTO"}
                withBackButton={drawerSelectedSection !== "home"}
                onBack={() => dispatch(selectMaintenanceSection(drawerSelectedSection === "clean-tyoe" ? "clean-staff" : "home"))}
                itemsMenu={[
                    { label: "Reportar incidencia", onClick: validateIsColabActive(() => setReport(true)) },
                    { label: "Bloquear habitación", onClick: validateIsColabActive(() => setLock(true)) },
                ]}
            >
                {drawerSelectedSection === "home" ? (
                    <Home onNavigate={handleNavigate} />
                ) : drawerSelectedSection === "mantenance-staff" ? (
                    <MaintenanceStaff 
                        isChangeStaffOnly
                    />
                ) : null}
            </DrawerWrapper>
            <LockRoom isOpen={lockModal} onClose={() => setLock(false)} />
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            {InactiveModal}
        </>
    )
}

export default Mantenimiento
