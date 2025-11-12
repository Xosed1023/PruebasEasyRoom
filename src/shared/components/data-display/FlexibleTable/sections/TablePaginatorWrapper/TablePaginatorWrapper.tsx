import React, { CSSProperties, ReactNode } from "react"
import Paginator, { PaginatorProps } from "../Paginator/Paginator"
import cx from 'classnames'

import "./TablePaginatorWrapper.css"

export interface TablePaginatorWrapperProps extends PaginatorProps {
    children: ReactNode
    className?: string
    style?: CSSProperties
}

const TablePaginatorWrapper = ({ children, currentPage, onChange, pages, className, style }: TablePaginatorWrapperProps) => {
    return (
        <div className={cx("table-paginator__wrapper", className)} style={style}>
            {children}
            {!!pages && <Paginator currentPage={currentPage} onChange={onChange} pages={pages} />}
        </div>
    )
}

export default TablePaginatorWrapper
