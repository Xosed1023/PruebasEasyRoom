import React, { CSSProperties, useEffect, useState } from "react"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

import "./TotalDetail.css"

const TotalDetail = ({
    label,
    value,
    type = "normal",
    className,
    style,
    signo,
}: {
    label: string
    value: number
    type?: "normal" | "thin" | "total"
    className?: string
    style?: CSSProperties
    signo?: boolean
}) => {
    const [textClass, settextClass] = useState("guest-resumen__total__detail__label")

    useEffect(() => {
        settextClass(
            type === "normal"
                ? "guest-resumen__total__detail__label"
                : type === "thin"
                ? "guest-resumen__total__detail__label--thin"
                : type === "total"
                ? "guest-resumen__total__detail__label--total"
                : ""
        )
    }, [type])

    return (
        <div className={`guest-resumen__total__detail ${className ? className : ""}`} style={style}>
            <span className={textClass}>{label}</span>
            <span className={textClass}>{signo ? `-${formatCurrency(value)}` : formatCurrency(value)}</span>
        </div>
    )
}

export default TotalDetail
