import * as React from "react"
import { memo } from "react"
import { JSX } from "react/jsx-runtime"
const SvgComponent = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={11} fill="none" {...props}>
        <path
            stroke="var(--deep-purple)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.667}
            d="M14.667 1 5.5 10.167 1.333 6"
        />
    </svg>
)

const IconCheck = memo(SvgComponent)
export default IconCheck
