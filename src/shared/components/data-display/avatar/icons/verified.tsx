import * as React from "react"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

function Verified(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_6_28)">
                <path
                    d="M15.444 3.542c.19.46.555.825 1.014 1.015l1.61.667a1.875 1.875 0 011.015 2.45l-.667 1.609c-.19.46-.19.976 0 1.435l.666 1.608a1.874 1.874 0 01-1.015 2.451l-1.609.667c-.46.19-.824.554-1.015 1.013l-.667 1.61a1.876 1.876 0 01-2.45 1.015l-1.608-.667c-.46-.19-.976-.189-1.435.002l-1.61.665a1.875 1.875 0 01-2.448-1.014l-.667-1.61a1.875 1.875 0 00-1.014-1.015l-1.61-.667A1.875 1.875 0 01.92 12.327l.667-1.608c.19-.46.189-.976-.002-1.435L.92 7.673a1.875 1.875 0 011.015-2.45l1.609-.667c.459-.19.824-.554 1.015-1.013l.666-1.61A1.875 1.875 0 017.674.92l1.609.666c.46.19.975.19 1.434 0L12.329.92a1.875 1.875 0 012.45 1.014l.666 1.61v-.002z"
                    fill="#0788F5"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.917 7.379a.938.938 0 00-1.583-1.008L8.663 12.14l-1.68-2.1a.938.938 0 00-1.465 1.171l2.5 3.125a.937.937 0 001.524-.082l4.375-6.875z"
                    fill="#fff"
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_6_28">
                    <path fill="#fff" d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default Verified
