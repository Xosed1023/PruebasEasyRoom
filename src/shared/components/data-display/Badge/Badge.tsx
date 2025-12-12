import cx from "classnames"

import './Badge.css'

const Badge = ({ state, label }: { state: "success" | "warning" | "danger" | "disabled"; label: string }) => {
    return (
        <div
            className={cx({
                "badge__text": true,
                "badge--warning": state === "warning",
                "badge--success": state === "success",
                "badge--disabled": state === "disabled",
                "badge--danger": state === "danger",
            })}
        >
            {label}
        </div>
    )
}

export default Badge
