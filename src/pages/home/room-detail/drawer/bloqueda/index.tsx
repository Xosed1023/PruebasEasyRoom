import { useState } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Home from "./sections/Home"
import CleanStaff from "../general/sections/CleanStaff"
import CleanType from "../general/sections/CleanType"
import Booking from "../general/sections/Booking"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { selectBloqueadaSection } from "src/store/roomDetails/bloqueadaSlice"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function Bloqueada(): JSX.Element {
    const [state, setState] = useState<any>({})
    const [reportModal, setReport] = useState<boolean>(false)
    const { rolName } = useProfile()
    const { drawerSelectedSection } = useSelector((root: RootState) => root.roomDetails.bloqueada)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const dispatch = useDispatch()

    const handleNavigate = validateIsColabActive((value, state: any) => {
        dispatch(selectBloqueadaSection(value))
        if (state) setState(state)
    })

    const [motivoMantenimiento, setmotivoMantenimiento] = useState("")

    return (
        <>
            <DrawerWrapper
                withMenu={drawerSelectedSection === "home" && rolName !== "MANTENIMIENTO"}
                withBackButton={drawerSelectedSection !== "home"}
                onBack={() => {
                    dispatch(selectBloqueadaSection(drawerSelectedSection === "clean-tyoe" ? "clean-staff" : "home"))

                    if (drawerSelectedSection === "clean-tyoe") {
                        return dispatch(selectBloqueadaSection("clean-staff"))
                    }
                    if (drawerSelectedSection === "clean-staff") {
                        return dispatch(selectBloqueadaSection("home"))
                    }
                    if (drawerSelectedSection === "mantenance-staff") {
                        return dispatch(selectBloqueadaSection("mantenance-reason"))
                    }
                    dispatch(selectBloqueadaSection("home"))
                }}
                itemsMenu={[{ label: "Reportar incidencia", onClick: validateIsColabActive(() => setReport(true)) }]}
            >
                {drawerSelectedSection === "home" ? (
                    <Home onNavigate={handleNavigate} />
                ) : drawerSelectedSection === "clean-staff" ? (
                    <CleanStaff onNavigate={handleNavigate} />
                ) : drawerSelectedSection === "clean-tyoe" ? (
                    <CleanType onNavigate={handleNavigate} state={state} />
                ) : drawerSelectedSection === "mantenance-staff" ? (
                    <MaintenanceStaff motivoMantenimiento={motivoMantenimiento} />
                ) : drawerSelectedSection === "mantenance-reason" ? (
                    <MaintenanceType onConfirm={(reason) => {
                        setmotivoMantenimiento(reason)
                        dispatch(selectBloqueadaSection("mantenance-staff"))
                    }} />
                ) : drawerSelectedSection === "booking" ? (
                    <Booking />
                ) : null}
            </DrawerWrapper>
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            {InactiveModal}
        </>
    )
}
export default Bloqueada
