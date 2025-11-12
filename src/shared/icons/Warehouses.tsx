import * as React from "react"
const Warehouses = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none" {...props}>
        <circle cx={30} cy={30} r={30} fill="#EFE9FF" />
        <g clipPath="url(#a)">
            <path
                fill="#6941C6"
                d="M44.167 31.625H40V36.5l-1.667-1.082-1.666 1.082v-4.875H32.5a.826.826 0 0 0-.833.813v9.75c0 .446.375.812.833.812h11.667a.826.826 0 0 0 .833-.813v-9.75a.826.826 0 0 0-.833-.812Zm-20-3.25h11.666a.826.826 0 0 0 .834-.813v-9.75a.826.826 0 0 0-.834-.812h-4.166v4.875L30 20.793l-1.667 1.082V17h-4.166a.826.826 0 0 0-.834.813v9.75c0 .446.375.812.834.812Zm3.333 3.25h-4.167V36.5l-1.666-1.082L20 36.5v-4.875h-4.167a.826.826 0 0 0-.833.813v9.75c0 .446.375.812.833.812H27.5a.826.826 0 0 0 .833-.813v-9.75a.826.826 0 0 0-.833-.812Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M15 17h30v26H15z" />
            </clipPath>
        </defs>
    </svg>
)
export default Warehouses
