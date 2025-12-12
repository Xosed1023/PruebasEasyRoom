import React from 'react'
import { IconProps } from './interfaces/IconProps.interface'

const BedFilled = (props: IconProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_224_33528)">
                <path d="M21.6155 11.0374V19.6913H19.6925V16.8066H4.30784V19.6913H2.38477V4.30664H4.30784V13.922H12.0001V7.19126H17.7694C18.7894 7.19126 19.7677 7.59647 20.489 8.31777C21.2103 9.03906 21.6155 10.0173 21.6155 11.0374ZM8.154 12.9605C7.38895 12.9605 6.65524 12.6566 6.11427 12.1156C5.57329 11.5746 5.26938 10.8409 5.26938 10.0759C5.26938 9.31082 5.57329 8.57711 6.11427 8.03614C6.65524 7.49517 7.38895 7.19126 8.154 7.19126C8.91904 7.19126 9.65276 7.49517 10.1937 8.03614C10.7347 8.57711 11.0386 9.31082 11.0386 10.0759C11.0386 10.8409 10.7347 11.5746 10.1937 12.1156C9.65276 12.6566 8.91904 12.9605 8.154 12.9605Z" fill={props.color || "#000000"} />
            </g>
            <defs>
                <clipPath id="clip0_224_33528">
                    <rect width="23.0769" height="23.0769" fill={props.color || "#000000"} transform="translate(0.460938 0.460938)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default BedFilled