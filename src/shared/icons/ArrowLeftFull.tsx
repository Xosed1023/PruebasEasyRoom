import React from 'react'
import { IconProps } from './interfaces/IconProps.interface'

const ArrowLeftFull = (props: IconProps) => {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M28.5 18H7.5M7.5 18L18 28.5M7.5 18L18 7.5" stroke={props.color || "#000"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default ArrowLeftFull