import "./Paginator.css"
import Page from "./Page/Page"
import ButtonArrow from "./ButtonArrow/ButtonArrow"
import { Fragment, useEffect, useState } from "react"

export interface PaginatorProps {
    currentPage: number
    pages: number
    onChange: (p: number) => void
}

const Paginator = ({ currentPage, pages, onChange }: PaginatorProps) => {
    const onSelect = (p: number) => {
        if (p === currentPage) {
            return
        }
        onChange(p)
    }

    const onArrowClick = (from: "left" | "right") => {
        if (from === "left") {
            if (currentPage === 0) {
                return
            }
            onChange(currentPage - 1)
        }
        if (from === "right") {
            if (currentPage >= pages) {
                return
            }
            onChange(currentPage + 1)
        }
    }

    const [visiblePages, setVisiblePages] = useState<number[]>([])

    useEffect(() => {
        const visiblePagesList: number[] = []

        if (pages > 4) {
            visiblePagesList.push(1)
            visiblePagesList.push(
                currentPage === 1
                    ? 2
                    : currentPage === 2
                    ? 2
                    : currentPage > 2 && currentPage < pages - 1
                    ? currentPage
                    : 2
            )
            visiblePagesList.push(pages - 1)
            visiblePagesList.push(pages)
            setVisiblePages(visiblePagesList)
            return
        }
        Array.from({ length: pages }).forEach((item, index) => {
            visiblePagesList.push(index + 1)
        })
        setVisiblePages(visiblePagesList)
    }, [pages, currentPage])

    return (
        <div className="table__paginator">
            <ButtonArrow disabled={currentPage === 1} from="left" onClick={onArrowClick} />
            {visiblePages.map((p, index) => {
                if (index === 2) {
                    return (
                        <Fragment key={index}>
                            {pages > 4 && (
                                <Page
                                    onClick={onSelect}
                                    isEllipsis
                                    num={p}
                                    selected={false}
                                />
                            )}
                            <Page
                                onClick={onSelect}
                                num={p}
                                selected={p === currentPage}
                            />
                        </Fragment>
                    )
                }
                return <Page onClick={onSelect} key={`paginator-page-${index}`} num={p} selected={p === currentPage} />
            })}
            <ButtonArrow disabled={currentPage === pages} from="right" onClick={onArrowClick} />
        </div>
    )
}

export default Paginator
