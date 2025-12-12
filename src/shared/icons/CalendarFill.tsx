import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CalendarFill = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <g clipPath="url(#clip0_7496_19346)">
                <path
                    d="M1.33398 7.33335H14.6673V13.3334C14.6673 13.5102 14.5971 13.6797 14.4721 13.8048C14.347 13.9298 14.1775 14 14.0007 14H2.00065C1.82384 14 1.65427 13.9298 1.52925 13.8048C1.40422 13.6797 1.33398 13.5102 1.33398 13.3334V7.33335ZM11.334 2.00002H14.0007C14.1775 2.00002 14.347 2.07026 14.4721 2.19528C14.5971 2.32031 14.6673 2.48988 14.6673 2.66669V6.00002H1.33398V2.66669C1.33398 2.48988 1.40422 2.32031 1.52925 2.19528C1.65427 2.07026 1.82384 2.00002 2.00065 2.00002H4.66732V0.666687H6.00065V2.00002H10.0007V0.666687H11.334V2.00002Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_7496_19346">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default CalendarFill
