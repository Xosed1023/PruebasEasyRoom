import React, { ReactNode } from "react"

import "./DrawerWrapper.css"
import DrawerFooter from "../DrawerFooter/DrawerFooter"

const DrawerWrappper = ({ children, footerChildren, hasBackButton, className }: { children: ReactNode; footerChildren?: ReactNode[] | ReactNode, hasBackButton?: boolean, className?: string }) => {
    return (
        <div className={`drawerPersonalWrapper`} style={{marginTop: hasBackButton ? "56px" : ""}}>
            <div className={`drawerPersonalWrapper__main ${className ? className : ""}`}>
                {children}
            </div>
            {!!footerChildren && <DrawerFooter footerChildren={footerChildren} />}
        </div>
    )
}

export default DrawerWrappper
