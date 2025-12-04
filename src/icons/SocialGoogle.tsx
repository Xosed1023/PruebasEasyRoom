import { memo } from "react"
import { IconProps } from "./Icon.type"

const SocialGoogle = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    fill="#4285F4"
                    d="M23.764 12.276c0-.816-.066-1.636-.207-2.438H12.238v4.62h6.482a5.555 5.555 0 0 1-2.399 3.647v2.999h3.867c2.271-2.09 3.576-5.177 3.576-8.828Z"
                />
                <path
                    fill="#34A853"
                    d="M12.24 24.001c3.236 0 5.965-1.062 7.954-2.897l-3.867-2.998c-1.076.732-2.465 1.146-4.084 1.146-3.13 0-5.785-2.112-6.737-4.951h-3.99v3.09a12.002 12.002 0 0 0 10.723 6.61Z"
                />
                <path
                    fill="#FBBC04"
                    d="M5.5 14.3a7.188 7.188 0 0 1 0-4.594v-3.09H1.516a12.01 12.01 0 0 0 0 10.776L5.5 14.3Z"
                />
                <path
                    fill="#EA4335"
                    d="M12.24 4.75a6.521 6.521 0 0 1 4.603 1.799l3.425-3.426A11.533 11.533 0 0 0 12.24 0 11.998 11.998 0 0 0 1.516 6.615l3.986 3.09C6.45 6.863 9.108 4.75 12.239 4.75Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default SocialGoogle
