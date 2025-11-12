import React from "react"

import "./Page.css"

export interface PageProps {
    selected: boolean
    num: number
    isEllipsis?: boolean
    onClick: (p: number) => void
}

const Page = ({ selected, num, onClick, isEllipsis = false }: PageProps) => {
    return (
        <div
            className={`paginator__page ${selected ? "paginator__page--selected" : ""}`}
            onClick={() => (!isEllipsis ? onClick(num) : null)}
            style={{
                borderLeft: num === 1 ? "1px solid var(--Scroll, #EAECF0)" : "",
            }}
        >
            <span className="paginator__page__text">{isEllipsis ? "..." : num}</span>
        </div>
    )
}

export default Page
