import cx from "classnames"
import "./BgBlur.css"

const BgBlur = ({
    visible,
    className = "",
    onClose,
}: {
    visible: boolean
    className?: string
    onClose?: () => void
}) => {
    return (
        <section
            className={cx("BgBlur", visible ? "BgBlur--state--open" : "BgBlur--state--close", className)}
            onClick={onClose}
        />
    )
}

export default BgBlur
