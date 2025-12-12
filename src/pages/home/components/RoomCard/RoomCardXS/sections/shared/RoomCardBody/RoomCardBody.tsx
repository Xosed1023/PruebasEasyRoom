import { CSSProperties, ReactNode } from "react"

import "./RoomCardBody.css"

const RoomCardBody = ({ children, style, easyrewards }: { children: ReactNode; style?: CSSProperties, easyrewards?: string }) => {

    return (
        <>
            <div className="room-card--xs__body" style={style}>
                {children}
            </div>
        </>
    )
}

export default RoomCardBody
