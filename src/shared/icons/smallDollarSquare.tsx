import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const SmallDollarSquare = memo((props: IconProps) => {
    const { color = "#6941C6", ...rest } = props
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={25} height={26} fill="none" {...rest}>
            <g>
                <path
                    fill={color}
                    d="M3.125 3.672h18.75a1.042 1.042 0 0 1 1.042 1.041V21.38a1.041 1.041 0 0 1-1.042 1.042H3.125a1.041 1.041 0 0 1-1.042-1.042V4.713a1.042 1.042 0 0 1 1.042-1.041Zm5.73 11.458v2.083h2.603v2.084h2.084v-2.084h1.041a2.605 2.605 0 0 0 0-5.208h-4.166a.52.52 0 0 1 0-1.042h5.729V8.88h-2.604V6.797h-2.084V8.88h-1.041a2.604 2.604 0 0 0 0 5.208h4.166a.521.521 0 0 1 0 1.042H8.854Z"
                />
            </g>
        </svg>
    )
})

export default SmallDollarSquare
