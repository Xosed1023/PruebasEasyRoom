import { IconProps } from "./Icon.type"

const UserFill = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M7.9987 7.99943C6.15775 7.99943 4.66536 6.50705 4.66536 4.6661C4.66536 2.82515 6.15775 1.33276 7.9987 1.33276C9.83965 1.33276 11.332 2.82515 11.332 4.6661C11.332 6.50705 9.83965 7.99943 7.9987 7.99943Z"
                fill={color}
            />
            <path
                d="M2.27323 14.6659C2.27323 12.0859 4.8399 9.99927 7.9999 9.99927C11.1599 9.99927 13.7266 12.0859 13.7266 14.6659"
                fill={color}
            />
        </svg>
    )
}

export default UserFill
