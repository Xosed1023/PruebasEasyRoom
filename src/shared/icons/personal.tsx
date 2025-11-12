import * as React from "react"
import { SVGProps, memo } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} fill="none" {...props}>
        <g clipPath="url(#a)">
            <path
                fill="#0E0E0E"
                d="M11.88 10.666a4.666 4.666 0 1 0-6.779 0 3.997 3.997 0 0 1 5.327-1.375 3.997 3.997 0 0 1 1.452 1.375Zm-3.39 5.278L4.249 11.7a6 6 0 1 1 8.485 0l-4.242 4.243Zm0-7.819a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M.49.125h16v16h-16z" />
            </clipPath>
        </defs>
    </svg>
)
const personalMap = memo(SvgComponent)
export default personalMap
