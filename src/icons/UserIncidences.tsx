import { SVGProps } from "react"
const UserIncidences = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <path
      stroke="#5374AE"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.001 7.999a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667ZM13.727 14.667C13.727 12.087 11.16 10 8 10s-5.727 2.087-5.727 4.667"
    />
  </svg>
)

export default UserIncidences
