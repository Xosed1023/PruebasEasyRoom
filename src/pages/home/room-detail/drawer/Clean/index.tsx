import "./index.css"
import { useEffect, useState } from "react"
import Home from "./sections/Home/Home"
import Reservation from "./sections/Reservation/Reservation"
import CleanStaff from "../general/sections/CleanStaff"
import CleanType from "../general/sections/CleanType"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import DrawerWrapper from "../../sections/DrawerWrapper"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export type CleanDetailSection =
    | "home"
    | "maintenance"
    | "reservation"
    | "clean-staff"
    | "clean-tyoe"
    | "maintenance-reason"

function Clean(): JSX.Element {
    const [selectedSection, setSelectedSection] = useState<CleanDetailSection>("home")
    const { isRoomDetailsDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const [state, setState] = useState<any>({})
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    useEffect(() => {
        if (!isRoomDetailsDrawerOpen) {
            setSelectedSection("home")
        }
    }, [isRoomDetailsDrawerOpen])

    const handleNavigate = validateIsColabActive((value: any, state: any) => {
        setSelectedSection(value)
        if (state) setState(state)
    })

    const [maintenanceReason, setmaintenanceReason] = useState("")

    return (
        <>
            {selectedSection === "home" ? (
                <Home onChangeSection={validateIsColabActive((section) => setSelectedSection(section))} />
            ) : selectedSection === "maintenance-reason" ? (
                <DrawerWrapper withBackButton onBack={() => setSelectedSection("home")}>
                    <MaintenanceType
                        onConfirm={(reason) => {
                            setmaintenanceReason(reason)
                            setSelectedSection("maintenance")
                        }}
                    />
                </DrawerWrapper>
            ) : selectedSection === "maintenance" ? (
                <DrawerWrapper withBackButton onBack={() => setSelectedSection("maintenance-reason")}>
                    <MaintenanceStaff motivoMantenimiento={maintenanceReason} />
                </DrawerWrapper>
            ) : selectedSection === "reservation" ? (
                <Reservation onChangeSection={(section) => setSelectedSection(section)} />
            ) : selectedSection === "clean-staff" ? (
                <DrawerWrapper withBackButton onBack={() => setSelectedSection("home")}>
                    <CleanStaff onNavigate={handleNavigate} />
                </DrawerWrapper>
            ) : selectedSection === "clean-tyoe" ? (
                <DrawerWrapper withBackButton onBack={() => setSelectedSection("clean-staff")}>
                    <CleanType onNavigate={handleNavigate} state={state} />
                </DrawerWrapper>
            ) : (
                <></>
            )}
            {InactiveModal}
        </>
    )
}

export default Clean
