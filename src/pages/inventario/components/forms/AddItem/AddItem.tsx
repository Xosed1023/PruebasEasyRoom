import React from "react"

import "./AddItem.css"
import Icon from "src/shared/icons"

const AddItem = ({ title, onClick }: { title: string; onClick: () => void }) => {
    return (
        <div className="add__item" onClick={onClick}>
            <Icon name="plusCircle" color="var(--primary)" />
            <span className="add__item__title">{title}</span>
        </div>
    )
}

export default AddItem
