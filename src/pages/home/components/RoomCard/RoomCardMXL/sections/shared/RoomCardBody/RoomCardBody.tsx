import React, { CSSProperties, ReactNode } from 'react'

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

const RoomCardBody = ({ children, verticalAlign, style }: { children: ReactNode, verticalAlign: VerticalAlign, style?: CSSProperties }) => {
    return (
        <div className='room-card--mxl__body' style={{ justifyContent: verticalAlign, ...style }}>{children}</div>
    )
}

export default RoomCardBody

