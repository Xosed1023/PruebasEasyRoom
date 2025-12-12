import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BookMark = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 17" fill="none" {...rest}>
            <path
                fill={color}
                d="M9.23 14v1.667l-2-1.334-2 1.334V14h-.334a2.333 2.333 0 0 1-2.333-2.333V3.333a2 2 0 0 1 2-2h9.333a.667.667 0 0 1 .666.667v11.333a.667.667 0 0 1-.666.667H9.229Zm-4-1.333v-1.334h4v1.334h4v-2H4.895a1 1 0 1 0 0 2h.333Zm0-9.334v1.334h1.332V3.333H5.23Zm0 2v1.334h1.332V5.333H5.23Zm0 2v1.334h1.332V7.333H5.23Z"
            />
        </svg>
    )
})

export default BookMark
