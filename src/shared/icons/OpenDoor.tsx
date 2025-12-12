import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const OpenDoor = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                d="M18.594 16c.265 0 .531.266.531.598v1.029c0 .266-.266.498-.531.498h-3.719V5.375h-3.188V3.283l3.72-.033c.863 0 1.593.764 1.593 1.66V16h1.594zM9.297 1.191c.664-.199 1.328.332 1.328 1.063v15.871H.531c-.299 0-.531-.232-.531-.564v-1.03C0 16.266.232 16 .531 16h1.594V3.88c0-.497.299-.929.797-1.062l6.375-1.627zm-1.594 9.496c.432 0 .797-.464.797-1.062 0-.564-.365-.996-.797-.996-.465 0-.797.465-.797 1.03 0 .564.332 1.028.797 1.028z"
                fill={color}
            />
        </svg>
    )
})

export default OpenDoor
