import React from "react"
import { useDispatch, useSelector } from "react-redux"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import { selectPersonalDrawerSection, togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import { RootState } from "src/store/store"
import Home from "../DrawerSections/Home/Home"
import RoomsToClean from "../DrawerSections/RoomsToClean/RoomsToClean"
import TipoLimpieza from "../DrawerSections/TipoLimpieza/TipoLimpieza"
import RoomsToMaintenance from "../DrawerSections/RoomsToMaintenance/RoomsToMaintenance"
import MaintenanceType from "../DrawerSections/MaintenanceType/MaintenanceType"
import RoomsToReassign from "../DrawerSections/RoomsToReassign/RoomsToReassign"

const DrawerSection = ({handleRefetch}: {handleRefetch: () => void}) => {
    const { isPersonalTurnoDrawerOpen, drawerSelectedSection } = useSelector((root: RootState) => root.personal)
    const dispatch = useDispatch()
    return <Drawer 
        visible={isPersonalTurnoDrawerOpen}
        placement="right"
        onClose={() => {dispatch(togglePersonalTurnoDrawer(false))}}
        withCloseButton
        onBack={() => {
            if(drawerSelectedSection === "unclean-rooms" || drawerSelectedSection === "rooms-to-maintenance") {
                return dispatch(selectPersonalDrawerSection("home"))
            }
            if(drawerSelectedSection === "cleaning-types") {
                return dispatch(selectPersonalDrawerSection("unclean-rooms"))
            }
            if(drawerSelectedSection === "maintenance-reason") {
                return dispatch(selectPersonalDrawerSection("rooms-to-maintenance"))
            }
        }}
        withBackButton={drawerSelectedSection === "unclean-rooms" || drawerSelectedSection === "cleaning-types" || drawerSelectedSection === "rooms-to-maintenance" || drawerSelectedSection === "maintenance-reason"}
    >
        {
            drawerSelectedSection === "home" ? <Home handleRefetch={handleRefetch} /> : 
            drawerSelectedSection === "unclean-rooms" ? <RoomsToClean handleRefetch={handleRefetch} /> : 
            drawerSelectedSection === "cleaning-types" ? <TipoLimpieza handleRefetch={handleRefetch} /> : 
            drawerSelectedSection === "rooms-to-reassign-cleaning" ? <RoomsToReassign tipoTarea="limpieza" handleRefetch={handleRefetch} /> : 
            drawerSelectedSection === "rooms-to-reassign-maintenance" ? <RoomsToReassign tipoTarea="mantenimiento" handleRefetch={handleRefetch} /> : 
            drawerSelectedSection === "maintenance-reason" ? <MaintenanceType handleRefetch={handleRefetch} /> : 
            drawerSelectedSection === "rooms-to-maintenance" ? <RoomsToMaintenance handleRefetch={handleRefetch} /> : <></>
        }
    </Drawer>
}

export default DrawerSection
