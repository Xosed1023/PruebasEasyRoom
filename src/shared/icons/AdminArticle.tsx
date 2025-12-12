import * as React from "react"
const AdminArticle = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none" {...props}>
        <circle cx={30} cy={30} r={30} fill="#EFE9FF" />
        <g clipPath="url(#a)">
            <path
                fill="#6941C6"
                d="M22.5 20v5h15v-5h2.509c.685 0 1.241.556 1.241 1.241V41.26c0 .685-.556 1.241-1.241 1.241H19.99a1.242 1.242 0 0 1-1.241-1.241V21.241c0-.684.556-1.24 1.241-1.24H22.5Zm3.75 16.25h-2.5v2.5h2.5v-2.5Zm0-3.75h-2.5V35h2.5v-2.5Zm0-3.75h-2.5v2.5h2.5v-2.5ZM35 17.5v5H25v-5h10Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M15 15h30v30H15z" />
            </clipPath>
        </defs>
    </svg>
)
export default AdminArticle
