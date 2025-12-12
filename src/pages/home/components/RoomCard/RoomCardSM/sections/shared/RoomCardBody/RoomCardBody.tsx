import React, { CSSProperties, ReactNode } from 'react'

import './RoomCardBody.css'

const RoomCardBody = ({ children, style }: { children: ReactNode, style?: CSSProperties }) => {
    return (
        <div className='room-card--sm__body' style={style}>{children}</div>
    )
}

export default RoomCardBody