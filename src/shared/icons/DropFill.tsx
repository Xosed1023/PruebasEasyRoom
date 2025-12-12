import { IconProps } from "./interfaces/IconProps.interface"

const DropFill = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_9861_237)">
                <path
                    d="M3.74952 5.04931L7.99219 0.806641L12.2349 5.04931C13.074 5.88843 13.6454 6.95752 13.8769 8.12141C14.1084 9.28529 13.9896 10.4917 13.5355 11.588C13.0813 12.6844 12.3123 13.6215 11.3256 14.2807C10.3389 14.94 9.17887 15.2919 7.99219 15.2919C6.80551 15.2919 5.64547 14.94 4.65878 14.2807C3.67208 13.6215 2.90305 12.6844 2.44892 11.588C1.99479 10.4917 1.87597 9.28529 2.10747 8.12141C2.33898 6.95752 2.91042 5.88843 3.74952 5.04931Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_9861_237">
                    <rect width="16" height="16" fill="white" transform="translate(-0.0078125 0.625244)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default DropFill
