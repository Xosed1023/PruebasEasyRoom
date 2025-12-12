import React from "react"

import './Header.css'

const Header = ({ title }: { title: string }) => {
    return <div className="header-resumen-detalle-orden">
        <span className="header-resumen-detalle-orden__title">{title}</span>
    </div>
}

export default Header
