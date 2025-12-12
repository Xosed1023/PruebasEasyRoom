import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function calendarEvent(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12.261 2.163h2.885a.722.722 0 01.721.722v11.54a.721.721 0 01-.72.72H2.163a.721.721 0 01-.722-.72V2.885a.721.721 0 01.722-.722h2.885V.721H6.49v1.442h4.328V.721h1.442v1.442zM2.885 6.491v7.212h11.54V6.491H2.885zm1.442 2.885h3.607v2.885H4.327V9.376z"
                fill={props.color ?? "#fff"}
            />
        </svg>
    )
}

export default calendarEvent
