import { IconProps } from "./interfaces/IconProps.interface"

const activity = (props: IconProps) => (
    <svg width="1em" height="1em" viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21 10H17L14 19L8 1L5 10H1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export { activity }
