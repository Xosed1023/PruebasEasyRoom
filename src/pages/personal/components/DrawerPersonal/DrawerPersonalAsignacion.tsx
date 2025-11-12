import React, { useState } from "react"
import Drawer from "src/shared/components/layout/drawer/Drawer"

import "../DrawerSectionPersonal/DrawerSectionPersonal.css"
import DrawerPersonalMain from "./DrawerPersonalMain/DrawerPersonalMain"
import DrawerSelectRoom from "./DrawerSelectRoom/DrawerSelectRoom"
const DrawerPersonalAsignacion = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [main, setMain] = useState(true)
    const roomSelect = () => {
        setMain(false)
    }

    return (
        <Drawer placement={"right"} bar={false} visible={visible} withCloseButton={true} onClose={onClose}>
            {main && <DrawerPersonalMain onClose={onClose} roomSelect={roomSelect} />} {!main && <DrawerSelectRoom />}
        </Drawer>
    )
}

export default DrawerPersonalAsignacion
