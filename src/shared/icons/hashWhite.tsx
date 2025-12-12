import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const HashWhite = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
        <rect width={13.333} height={13.333} x={1.333} y={1.333} fill="#fff" rx={3} />
        <path
            fill="#303030"
            fillRule="evenodd"
            d="M7.27 2.548a.513.513 0 0 1 .435.573l-.268 2.535h1.97l.28-2.65a.5.5 0 0 1 .545-.458.513.513 0 0 1 .436.573L10.4 5.656h1.753c.273 0 .494.232.494.519a.507.507 0 0 1-.494.518H10.29l-.22 2.074h2.083c.273 0 .494.232.494.519a.507.507 0 0 1-.494.518H9.96l-.28 2.65a.5.5 0 0 1-.546.458.513.513 0 0 1-.436-.573l.268-2.535H6.998l-.28 2.65a.5.5 0 0 1-.546.458.513.513 0 0 1-.436-.573l.268-2.535H4.252a.507.507 0 0 1-.494-.518c0-.287.22-.519.494-.519h1.862l.22-2.074H4.252a.507.507 0 0 1-.494-.518c0-.287.22-.519.494-.519h2.191l.28-2.65a.5.5 0 0 1 .546-.458Zm1.807 6.22.22-2.075h-1.97l-.22 2.074h1.97Z"
            clipRule="evenodd"
        />
    </svg>
)
export default HashWhite
