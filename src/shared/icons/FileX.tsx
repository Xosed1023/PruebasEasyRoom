import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const FileX = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 19 22" fill="none" {...rest}>
            <path
                d="M11 10H5m2 4H5m8-8H5m12 5V5.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C14.72 1 13.88 1 12.2 1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C1 3.28 1 4.12 1 5.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C3.28 21 4.12 21 5.8 21H9m4-6l5 5m0-5l-5 5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default FileX
