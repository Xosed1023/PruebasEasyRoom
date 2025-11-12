import { useEffect, useState } from "react"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Home from "./sections/Home"
import CleanStaff from "./sections/CleanStaff"
import FinishClean from "./sections/FinishClean"
import Booking from "../general/sections/Booking"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { selectCleaningSection } from "src/store/roomDetails/cleaningSlice"
import MaintenanceStaff from "../general/sections/MaintenanceStaff/MaintenanceStaff"
import MaintenanceType from "../general/sections/MaintenanceType/MaintenanceType"
import { useRoomDarwer } from "../../hooks/darwer"
import ActiveCleanStaff from "./sections/ActiveCleanStaff"
import ChangeCleanType from "../general/sections/ChangeCleanType/ChangeCleanType"
import { startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import { useRoom } from "../../hooks"
import { selectRoom } from "src/store/rooms/roomsSlice"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function Limpieza(): JSX.Element {
    const [lockModal, setLock] = useState<boolean>(false)
    const [reportModal, setReport] = useState<boolean>(false)
    const { drawerSelectedSection } = useSelector((root: RootState) => root.roomDetails.cleaning)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const dispatch = useDispatch()
    const room = useRoom()
    const { rolName } = useProfile()

    const handleNavigate = validateIsColabActive((value, state: any) => {
        dispatch(selectCleaningSection(value))
    })

    const { visible } = useRoomDarwer()
    useEffect(() => {
        if (visible && drawerSelectedSection !== "home") dispatch(selectCleaningSection("home"))
    }, [visible])

    const [motivoMantenimiento, setmotivoMantenimiento] = useState("")

    return (
        <>
            <DrawerWrapper
                withMenu={drawerSelectedSection === "home" && rolName !== "MANTENIMIENTO"}
                withBackButton={drawerSelectedSection !== "home"}
                onBack={() => {
                    dispatch(selectCleaningSection(drawerSelectedSection === "clean-tyoe" ? "clean-staff" : "home"))
                    if (drawerSelectedSection === "clean-tyoe") {
                        return dispatch(selectCleaningSection("clean-staff"))
                    }
                    if (drawerSelectedSection === "clean-staff") {
                        return dispatch(selectCleaningSection("home"))
                    }
                    if (drawerSelectedSection === "mantenance-staff") {
                        return dispatch(selectCleaningSection("mantenance-reason"))
                    }
                    dispatch(selectCleaningSection("home"))
                }}
                itemsMenu={[
                    { label: "Reportar incidencia", onClick: validateIsColabActive(() => setReport(true)) },
                    { label: "Bloquear habitación", onClick: validateIsColabActive(() => setLock(true)) },
                ]}
            >
                {drawerSelectedSection === "home" ? (
                    <Home onNavigate={handleNavigate} />
                ) : drawerSelectedSection === "clean-staff" ? (
                    <CleanStaff onNavigate={handleNavigate} />
                ) : drawerSelectedSection === "finish-clean" ? (
                    <FinishClean />
                ) : drawerSelectedSection === "mantenance-staff" ? (
                    <MaintenanceStaff motivoMantenimiento={motivoMantenimiento} />
                ) : drawerSelectedSection === "mantenance-reason" ? (
                    <MaintenanceType
                        onConfirm={(reason) => {
                            setmotivoMantenimiento(reason)
                            dispatch(selectCleaningSection("mantenance-staff"))
                        }}
                    />
                ) : drawerSelectedSection === "booking" ? (
                    <Booking closePrevTask />
                ) : drawerSelectedSection === "change-clean-type" ? (
                    <ChangeCleanType
                        onConfirm={() => {
                            dispatch(selectCleaningSection("home"))
                            dispatch(
                                startGetSelectedRoom(room?.habitacion_id, false, () => {
                                    dispatch(selectRoom({}))
                                }
                                )
                            )
                        }}
                    />
                ) : drawerSelectedSection === "active-cleaning-staff" ? (
                    <ActiveCleanStaff />
                ) : null}
            </DrawerWrapper>
            <LockRoom isOpen={lockModal} onClose={() => setLock(false)} />
            <ReportIncidence isOpen={reportModal} onClose={() => setReport(false)} />
            {InactiveModal}
        </>
    )
}

export default Limpieza
