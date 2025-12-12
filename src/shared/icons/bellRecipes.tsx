import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BellRecipes = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={46} height={46} fill="none" {...props}>
            <g filter="url(#a)">
                <rect width={40} height={40} x={3} y={3} fill="#EFE9FF" rx={11.571} />
                <rect width={38} height={38} x={4} y={4} stroke="#6941C6" strokeWidth={2} rx={10.571} />
            </g>
            <path
                fill="#6941C6"
                d="M31.481 25.168c.26-.002.518.023.772.075v-.075a8.864 8.864 0 0 0-2.447-6.089 9.36 9.36 0 0 0-6.04-2.873v-1.538h.772c.205 0 .401-.079.546-.22a.74.74 0 0 0 .226-.53.74.74 0 0 0-.226-.53.783.783 0 0 0-.546-.22h-3.085c-.205 0-.401.079-.546.22a.74.74 0 0 0-.226.53c0 .199.081.39.226.53.145.141.341.22.546.22h.771v1.538a9.36 9.36 0 0 0-6.04 2.873 8.864 8.864 0 0 0-2.446 6.089v.075c.254-.052.513-.077.772-.075H31.48ZM31.489 26.742H14.517c-.613 0-1.202.237-1.636.66a2.219 2.219 0 0 0-.678 1.59c0 .597.244 1.17.678 1.591a2.348 2.348 0 0 0 1.636.66H31.49c.614 0 1.202-.238 1.636-.66.434-.422.678-.994.678-1.59 0-.598-.244-1.17-.678-1.592a2.348 2.348 0 0 0-1.636-.659Z"
            />
            <defs>
                <filter
                    id="a"
                    width={46}
                    height={46}
                    x={0}
                    y={0}
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feMorphology
                        in="SourceAlpha"
                        operator="dilate"
                        radius={1}
                        result="effect1_dropShadow_1548_41378"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation={1} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1548_41378" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_1548_41378" result="shape" />
                </filter>
            </defs>
        </svg>
    )
}

export default BellRecipes
