import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const Calendar = ({ color, size = "ch", ...props }: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_7497_27650)">
            <path
                d="M11.334 1.99999H14.0007C14.1775 1.99999 14.347 2.07023 14.4721 2.19525C14.5971 2.32028 14.6673 2.48985 14.6673 2.66666V13.3333C14.6673 13.5101 14.5971 13.6797 14.4721 13.8047C14.347 13.9298 14.1775 14 14.0007 14H2.00065C1.82384 14 1.65427 13.9298 1.52925 13.8047C1.40422 13.6797 1.33398 13.5101 1.33398 13.3333V2.66666C1.33398 2.48985 1.40422 2.32028 1.52925 2.19525C1.65427 2.07023 1.82384 1.99999 2.00065 1.99999H4.66732V0.666656H6.00065V1.99999H10.0007V0.666656H11.334V1.99999ZM2.66732 5.99999V12.6667H13.334V5.99999H2.66732ZM4.00065 8.66666H7.33398V11.3333H4.00065V8.66666Z"
                fill={color || "#000"}
            />
        </g>
        <defs>
            <clipPath id="clip0_7497_27650">
                <rect width="16" height="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
)
export default Calendar
