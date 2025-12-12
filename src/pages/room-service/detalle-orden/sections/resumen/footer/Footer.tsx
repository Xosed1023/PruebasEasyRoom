import React from "react"

import "./Footer.css"
import { Button } from "src/shared/components/forms"
import { ButtonProps } from "src/shared/components/forms/button/types/button.props";

const Footer = (buttonProps: ButtonProps) => {
    return (
        <div className="footer-detalle-orden">
            <Button style={{width: "100%"}} {...buttonProps}  />
        </div>
    )
}

export default Footer
