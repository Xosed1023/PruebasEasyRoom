import * as React from "react"
import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none">
        <path
            stroke={props.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 10.5H3m13-8v4m-8-4v4m-.2 16h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 20.22 21 19.38 21 17.7V9.3c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4.5 17.88 4.5 16.2 4.5H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.78 3 7.62 3 9.3v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327Z"
        />
    </svg>
)
const reservas = memo(SvgComponent)
export default reservas
