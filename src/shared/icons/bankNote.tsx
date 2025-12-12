import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BankNote = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                d="M9.333 6H7.667a1 1 0 100 2h.666a1 1 0 110 2H6.667M8 5.333V6m0 4v.667M12 8h.007M4 8h.007M1.333 5.467v5.066c0 .747 0 1.12.146 1.406.127.25.331.454.582.582.286.146.659.146 1.406.146h9.066c.747 0 1.12 0 1.406-.146.25-.127.454-.331.582-.582.146-.286.146-.659.146-1.406V5.467c0-.747 0-1.12-.146-1.406a1.334 1.334 0 00-.582-.582c-.286-.146-.659-.146-1.406-.146H3.467c-.747 0-1.12 0-1.406.146-.25.128-.454.332-.582.582-.146.286-.146.659-.146 1.406zm11 2.533a.333.333 0 11-.666 0 .333.333 0 01.666 0zm-8 0a.333.333 0 11-.666 0 .333.333 0 01.666 0z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default BankNote
