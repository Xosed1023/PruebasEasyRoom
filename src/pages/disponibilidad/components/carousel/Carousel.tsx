import { ReactNode, useEffect, useRef, useState } from "react"
import cx from "classnames"
import "./Carousel.css"
import { v4 as uuid } from "uuid"

const Carousel = ({
    children,
    timeout,
    itemsPerPage = 1,
    contentClassName = "",
    innerPaginator = false,
    className = "",
}: {
    children: ReactNode
    contentClassName?: string
    className?: string
    timeout: number
    itemsPerPage: number
    innerPaginator?: boolean
}) => {
    const [page, setPage] = useState(1)
    const interval = useRef<NodeJS.Timer>()

    const [childrenArray, setchildrenArray] = useState<ReactNode[]>([])
    const [animationClass, setanimationClass] = useState<"slide-in-right" | "slide-in-left">("slide-in-right")

    useEffect(() => {
        if (Array.isArray(children)) {
            setchildrenArray(Array.from(children))
            return
        }
        setchildrenArray([children])
    }, [children])

    useEffect(() => {
        clearInterval(interval.current)
        interval.current = setInterval(() => {
            setPage((p) => {
                setanimationClass(
                    p === Math.ceil(childrenArray.length / itemsPerPage) ? "slide-in-left" : "slide-in-right"
                )
                return p === Math.ceil(childrenArray.length / itemsPerPage) ? 1 : p + 1
            })
        }, timeout)
    }, [childrenArray, itemsPerPage, page])

    return (
        <div className={cx("flex-carousel", className)}>
            <div className={cx("flex-carousel__content", contentClassName)}>
                {childrenArray
                    .filter((child, index) => {
                        const startIndex = (page - 1) * itemsPerPage
                        const endIndex = startIndex + itemsPerPage
                        return index >= startIndex && index < endIndex
                    })
                    .map((child) => (
                        <div key={uuid()} className={animationClass}>
                            {child}
                        </div>
                    ))}
            </div>
            <div className={`flex-carousel__pages ${innerPaginator ? "inner" : ""}`}>
                {Array.from({ length: Math.ceil(childrenArray.length / itemsPerPage) }).map((_i, index) => (
                    <div
                        key={uuid()}
                        className={`flex-carousel__page ${index + 1 === page ? "active" : ""}`}
                        onClick={() => {
                            setPage(index + 1)
                            setanimationClass(index + 1 > page ? "slide-in-right" : "slide-in-left")
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default Carousel
