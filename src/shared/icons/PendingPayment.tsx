import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const PendingPayment = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <rect
                width={18.035}
                height={11.158}
                x={0.316}
                y={0.316}
                fill={color}
                stroke="#D4C1FF"
                strokeWidth={0.632}
                rx={1.579}
            />
            <g clipPath="url(#a)">
                <path
                    fill="#D4C1FF"
                    d="M7.139 6.862h2.911c.07 0 .137-.029.187-.08a.275.275 0 0 0 0-.384.261.261 0 0 0-.187-.08H7.933c-.351 0-.688-.143-.936-.397a1.376 1.376 0 0 1-.388-.96c0-.36.14-.706.388-.961s.585-.398.936-.398h.529V2.516h1.059v1.086h1.323V4.69H7.933a.261.261 0 0 0-.187.08.275.275 0 0 0 0 .383c.05.051.116.08.187.08h2.117c.35 0 .688.143.936.398.248.254.387.6.387.96s-.14.706-.387.96a1.306 1.306 0 0 1-.936.398h-.53v1.087H8.463V7.948H7.139V6.862Z"
                />
            </g>
            <rect
                width={17.404}
                height={10.526}
                x={2.96}
                y={2.843}
                fill={color}
                stroke="#D4C1FF"
                strokeWidth={1.263}
                rx={1.263}
            />
            <g clipPath="url(#b)">
                <path
                    fill="#D4C1FF"
                    d="M9.482 9.073h2.912c.07 0 .137-.029.187-.08a.275.275 0 0 0 0-.384.261.261 0 0 0-.187-.08h-2.118c-.35 0-.687-.143-.935-.397a1.376 1.376 0 0 1-.388-.96c0-.361.14-.706.388-.961s.584-.398.935-.398h.53V4.727h1.058v1.086h1.324V6.9h-2.912a.261.261 0 0 0-.187.08.275.275 0 0 0 0 .383c.05.051.117.08.187.08h2.118c.35 0 .687.143.935.398.249.254.388.6.388.96s-.14.706-.388.96a1.306 1.306 0 0 1-.935.398h-.53v1.087h-1.058v-1.087H9.482V9.073Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <rect width={7.036} height={7.221} x={5.445} y={2.211} fill="#fff" rx={1.444} />
                </clipPath>
                <clipPath id="b">
                    <rect width={7.036} height={7.221} x={7.773} y={4.422} fill="#fff" rx={1.444} />
                </clipPath>
            </defs>
        </svg>
    )
})

export default PendingPayment
