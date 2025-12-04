import { SVGProps } from "react"
const CameraPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <path
      stroke="#6941C6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22.5 11.5v3.1c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C19.46 21 18.34 21 16.1 21H8.9c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C2.5 17.96 2.5 16.84 2.5 14.6V9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C5.54 3 6.66 3 8.9 3H13m6.5 5V2m-3 3h6m-6 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    />
  </svg>
)

export default CameraPlus