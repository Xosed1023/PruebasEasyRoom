import React from "react"
import Icon, { COLLECTION } from "src/shared/icons/Icon"
import './LabelTitle.css'

const LabelTitle = ({ icon, text }: { icon: keyof typeof COLLECTION | (string & {}); text: string }) => {
    return (
        <div className="venta-habitacion__label-title">
            <Icon name={icon} width={14} height={14} />
            <span className="venta-habitacion__label-text">{text}</span>
        </div>
    )
}

export default LabelTitle
