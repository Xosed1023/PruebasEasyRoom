import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const MailVerify = memo((props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={61} height={60} fill="none" {...props}>
            <g clipPath="url(#a)">
                <path
                    fill="#6941C6"
                    d="M8 7.5h45a2.5 2.5 0 0 1 2.5 2.5v40a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 50V10A2.5 2.5 0 0 1 8 7.5Zm22.65 21.707L14.62 15.595l-3.237 3.81 19.3 16.387 18.952-16.4-3.27-3.782-15.713 13.598h-.002Z"
                />
                <g clipPath="url(#b)">
                    <path
                        fill="#408232"
                        d="m47.972 54.188 6.849-6.85-1.37-1.37-5.48 5.48-2.74-2.74-1.37 1.37 4.11 4.11Z"
                    />
                    <path
                        fill="#DBF6D4"
                        fillRule="evenodd"
                        d="M48.938 60a9.687 9.687 0 0 1-9.688-9.688 9.687 9.687 0 0 1 9.688-9.687 9.687 9.687 0 0 1 9.687 9.688A9.687 9.687 0 0 1 48.937 60Zm5.883-12.663-6.85 6.85-4.11-4.11 1.37-1.37 2.74 2.74 5.48-5.48 1.37 1.37Z"
                        clipRule="evenodd"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M.5 0h60v60H.5z" />
                </clipPath>
                <clipPath id="b">
                    <path fill="#fff" d="M39.25 38.75H60.5V60H39.25z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default MailVerify
