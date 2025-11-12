import React, { ReactNode } from 'react'

import './RoomCardBody.css'

type VerticalAlign = "center" |
    "start" |
    "end" |
    "flex-start" |
    "flex-end" |
    "left" |
    "right" |
    "normal" |
    "space-between" |
    "space-around" |
    "space-evenly" |
    "stretch" |
    "inherit" |
    "initial" |
    "revert" |
    "revert-layer" |
    "unset";

const RoomCardBody = ({ children, verticalAlign }: { children: ReactNode, verticalAlign: VerticalAlign }) => {
    return (
        <div className='room-card--xl__body' style={{ justifyContent: verticalAlign }}>{children}</div>
    )
}

export default RoomCardBody

