import * as React from "react"
const Processes = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none" {...props}>
        <circle cx={30} cy={30} r={30} fill="#EFE9FF" />
        <path
            fill="#6941C6"
            d="M41.333 22.833v15.834A3.337 3.337 0 0 1 38 42H21.333A3.337 3.337 0 0 1 18 38.667V17.833a.831.831 0 0 1 .833-.833h3.334a.831.831 0 0 1 .833.833v8.653l8.794-4.398a.833.833 0 0 1 1.206.745v3.529l7.071-4.243a.834.834 0 0 1 1.262.714ZM24.667 32h-3.334v3.333h3.334V32Zm6.666 0H28v3.333h3.333V32ZM38 32h-3.333v3.333H38V32Z"
        />
    </svg>
)
export default Processes
