import * as React from "react"
import { memo } from "react"
import { JSX } from "react/jsx-runtime"
const SvgComponent = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={8} fill="none" {...props}>
        <path
            stroke="var(--slate-gray)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.667}
            d="m1 1.5 5 5 5-5"
        />
    </svg>
)

const IconArrow = memo(SvgComponent)
export default IconArrow
