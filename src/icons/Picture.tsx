import { memo } from "react"
import { IconProps } from "./Icon.type"

const Picture = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.58}
                d="M2.85 13.819 7.249 9.42c.264-.264.396-.396.549-.446a.667.667 0 0 1 .412 0c.152.05.284.182.548.446l4.368 4.368M9.335 10l1.913-1.912c.264-.264.396-.396.549-.446a.667.667 0 0 1 .412 0c.152.05.284.182.548.446L14.669 10m-8-4a1.333 1.333 0 1 1-2.666 0 1.333 1.333 0 0 1 2.666 0Zm-2.133 8h6.933c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C13.15 2 12.59 2 11.47 2H4.536c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874c-.218.428-.218.988-.218 2.108v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218Z"
            />
        </svg>
    )
})

export default Picture
