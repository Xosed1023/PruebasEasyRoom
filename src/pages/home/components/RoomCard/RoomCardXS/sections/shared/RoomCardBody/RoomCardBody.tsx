import React, { CSSProperties, ReactNode, useEffect, useRef } from "react"

import "./RoomCardBody.css"

const RoomCardBody = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null)
    const fillRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current && fillRef.current) {
            fillRef.current.style.height = ref.current.getBoundingClientRect().height / 8 + "px"
        }
    }, [])

    return (
        <>
            <div className="room-card--xs__body" ref={ref} style={style}>
                {children}
            </div>
            <div ref={fillRef}></div>
        </>
    )
}

export default RoomCardBody
