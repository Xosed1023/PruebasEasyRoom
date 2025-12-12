import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function iconHash(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_35_7)">
                <path
                    d="M21 0H3a3 3 0 00-3 3v18a3 3 0 003 3h18a3 3 0 003-3V3a3 3 0 00-3-3z"
                    fill={props.color || "#000"}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.32 2.673c.488.056.84.518.786 1.03l-.483 4.564h3.544l.505-4.77c.054-.512.494-.881.982-.824.488.056.84.518.785 1.03l-.483 4.564h3.155c.491 0 .889.418.889.933 0 .516-.398.933-.889.933H15.76l-.396 3.734h3.748c.491 0 .889.418.889.933 0 .515-.398.933-.889.933h-3.945l-.505 4.77c-.054.512-.493.881-.981.825-.488-.057-.84-.519-.786-1.031l.483-4.564H9.833l-.505 4.77c-.054.512-.494.881-.982.825-.488-.057-.84-.519-.785-1.031l.483-4.564H4.889c-.491 0-.889-.418-.889-.933 0-.515.398-.933.889-.933H8.24l.396-3.734H4.889C4.398 10.133 4 9.716 4 9.2c0-.515.398-.933.889-.933h3.945l.505-4.77c.054-.512.493-.881.981-.824zm3.255 11.194l.395-3.734h-3.545l-.395 3.734h3.545z"
                    fill="#fff"
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_35_7">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default iconHash
