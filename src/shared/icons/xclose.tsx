import { SVGProps } from "react"

type Props = SVGProps<SVGSVGElement>

const Xclose = (props: Props) => (
    <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M5.92391 1.57697L1.07776 6.42312M1.07776 1.57697L5.92391 6.42312"
            stroke={props.color || "#000"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default Xclose
