import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const CalendarChecked = ({ color, size = "ch", ...props }: IconProps) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_1530_71102)">
            <path d="M8.24967 0.916992V2.75033H13.7497V0.916992H15.583V2.75033H19.2497C19.4928 2.75033 19.7259 2.8469 19.8979 3.01881C20.0698 3.19072 20.1663 3.42388 20.1663 3.66699V18.3337C20.1663 18.5768 20.0698 18.8099 19.8979 18.9818C19.7259 19.1537 19.4928 19.2503 19.2497 19.2503H2.74967C2.50656 19.2503 2.2734 19.1537 2.10149 18.9818C1.92958 18.8099 1.83301 18.5768 1.83301 18.3337V3.66699C1.83301 3.42388 1.92958 3.19072 2.10149 3.01881C2.2734 2.8469 2.50656 2.75033 2.74967 2.75033H6.41634V0.916992H8.24967ZM18.333 7.33366H3.66634V17.417H18.333V7.33366ZM13.7827 9.29166L15.0788 10.5878L10.5413 15.1253L7.30001 11.884L8.59801 10.5878L10.5423 12.533L13.7836 9.29166H13.7827Z" fill={color || "#000"} />
        </g>
        <defs>
            <clipPath id="clip0_1530_71102">
                <rect width="22" height="22" fill={color || "#000"} />
            </clipPath>
        </defs>
    </svg>

)
export default CalendarChecked
