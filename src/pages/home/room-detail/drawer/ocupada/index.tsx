import "./index.css"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import Home from "./sections/Home"
import { selectRoom } from "src/store/rooms/roomsSlice"

export type OccupiedDetailSection = "home" | "maintenance" | "reservation"

function Ocupada(): JSX.Element {
    const [selectedSection, setSelectedSection] = useState<OccupiedDetailSection>("home")
    const { isRoomDetailsDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isRoomDetailsDrawerOpen) {
            setSelectedSection("home")
            setTimeout(() => {
                dispatch(selectRoom({}))
            }, 500)
        }
    }, [isRoomDetailsDrawerOpen])

    return selectedSection === "home" ? <Home onChangeSection={(section) => setSelectedSection(section)} /> : <></>
}

export default Ocupada
