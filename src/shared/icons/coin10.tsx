import { IconNamesProps } from "./Icon"

const coin10 = (props: IconNamesProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none">
        <path
            stroke={props.color || "#000"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M38.334.334A25.333 25.333 0 0 1 48.76 48.762a25.333 25.333 0 1 1-33.522-33.523A25.343 25.343 0 0 1 38.334.335Zm-12.666 19a19 19 0 1 0 0 37.998 19 19 0 0 0 0-37.998Zm3.166 3.167v3.166h6.334v6.334H22.5a1.583 1.583 0 0 0-.285 3.141l.285.025h6.333a7.917 7.917 0 0 1 0 15.834v3.166h-6.333v-3.166h-6.333v-6.334h12.666a1.583 1.583 0 0 0 .285-3.141l-.285-.025h-6.333a7.917 7.917 0 0 1 0-15.834v-3.166h6.333Zm9.5-15.834a18.953 18.953 0 0 0-14.199 6.375 25.334 25.334 0 0 1 26.822 26.825 19 19 0 0 0-12.623-33.2Z"
        />
    </svg>
)
export default coin10
