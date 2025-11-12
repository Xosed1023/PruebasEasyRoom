import React, { ReactNode } from "react"

import "./DrawerFooter.css"

const DrawerFooter = ({ footerChildren }: { footerChildren: ReactNode[] | ReactNode }) => {
    return (
        <div className="drawerPersonalWrapper__footer">
            <div className="drawerPersonalWrapper__footer__divider"></div>
            {footerChildren}
        </div>
    )
}

export default DrawerFooter
