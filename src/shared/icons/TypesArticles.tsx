import * as React from "react"
const TypesArticles = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none" {...props}>
        <circle cx={30} cy={30} r={30} fill="#EFE9FF" />
        <g clipPath="url(#a)">
            <path
                fill="#6941C6"
                d="M28.627 17.625 41 19.394l1.767 12.375-11.49 11.49a1.25 1.25 0 0 1-1.767 0L17.136 30.884a1.25 1.25 0 0 1 0-1.768l11.49-11.491Zm3.535 10.608a2.5 2.5 0 1 0 3.536-3.538 2.5 2.5 0 0 0-3.536 3.538Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M15 15h30v30H15z" />
            </clipPath>
        </defs>
    </svg>
)
export default TypesArticles
