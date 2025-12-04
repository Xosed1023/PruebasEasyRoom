import { SVGProps } from "react"
const User = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <path
      stroke="#0E0E0E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.999 10.001a4.167 4.167 0 1 0 0-8.333 4.167 4.167 0 0 0 0 8.333ZM17.157 18.333c0-3.225-3.209-5.833-7.159-5.833-3.95 0-7.158 2.608-7.158 5.833"
    />
  </svg>
)

export default User
