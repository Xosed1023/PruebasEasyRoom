import React, { JSXElementConstructor, ReactElement, ReactNode, useState } from "react"
import "./TableWrapper.css"
import cn from "classnames"

function cloneWithProps<P>(element: ReactElement<P>, newProps: Partial<P>): ReactElement<P> {
    return React.cloneElement(element, {
        ...element.props, // props originales
        ...newProps, // props nuevos sobrescriben si coinciden
    })
}

const TableWrappper = ({
    children,
    isThisComponentInsideAPaginatorWrapper = true,
}: {
    children: ReactNode
    isThisComponentInsideAPaginatorWrapper?: boolean
}) => {
    const [showGradientY, setShowGradientY] = useState(false)
    const [showGradientX, setShowGradientX] = useState(false)

    const clonedTable = cloneWithProps(children as ReactElement<any, string | JSXElementConstructor<any>>, {
        onHasScrollChange: setShowGradientY,
        onHasXScrollChange: setShowGradientX,
        containterClassName: cn(
            (children as any)?.props?.containterClassName,
            showGradientY
                ? !isThisComponentInsideAPaginatorWrapper
                    ? "flexible-table--gradient"
                    : "flexible-table--gradient--with-paginator"
                : "",
            showGradientX
                ? !isThisComponentInsideAPaginatorWrapper
                    ? "flexible-table--gradientX"
                    : "flexible-table--gradientX--with-paginator"
                : ""
        ),
    })

    return clonedTable
}

export default TableWrappper
