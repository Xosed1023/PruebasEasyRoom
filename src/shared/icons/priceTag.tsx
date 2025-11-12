import { IconProps } from "./interfaces/IconProps.interface"

function priceTag(props: IconProps) {
    const { color = "#6941C6", ...rest } = props
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    fill={color}
                    d="m7.267 1.4 6.6.943.942 6.6-6.128 6.128a.667.667 0 0 1-.942 0l-6.6-6.6a.667.667 0 0 1 0-.942l6.128-6.13Zm1.886 5.657a1.333 1.333 0 1 0 1.885-1.886 1.333 1.333 0 0 0-1.885 1.886Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default priceTag
