import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function habitacion(props: IconProps) {
    return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_1160_59440)">
                <path d="M43.7487 44.7915H47.9154V48.9582H2.08203V44.7915H6.2487V9.37484C6.2487 8.8223 6.46819 8.2924 6.85889 7.9017C7.24959 7.511 7.7795 7.2915 8.33203 7.2915H41.6654C42.2179 7.2915 42.7478 7.511 43.1385 7.9017C43.5292 8.2924 43.7487 8.8223 43.7487 9.37484V44.7915ZM16.6654 26.0415V30.2082H22.9154V26.0415H16.6654ZM16.6654 17.7082V21.8748H22.9154V17.7082H16.6654ZM16.6654 34.3748V38.5415H22.9154V34.3748H16.6654ZM27.082 34.3748V38.5415H33.332V34.3748H27.082ZM27.082 26.0415V30.2082H33.332V26.0415H27.082ZM27.082 17.7082V21.8748H33.332V17.7082H27.082Z" fill={props.color || "#000"} />
            </g>
            <defs>
                <clipPath id="clip0_1160_59440">
                    <rect width="50" height="50" fill="white" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default habitacion
