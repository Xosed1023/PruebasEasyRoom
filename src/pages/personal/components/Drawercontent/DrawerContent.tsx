import React, { ReactNode } from "react"

import "./DrawerContent.css"

const DrawerContent = ({ children }: { children: ReactNode[] | ReactNode }) => {
    return <div className="drawerPersonal-content">{children}</div>
}

export default DrawerContent
