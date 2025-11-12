import cx from "classnames"
import Icon from "src/shared/icons"
import { IconNamesProps } from "src/shared/icons/Icon"
import "./FloatButon.css"

const FloatButon = ({
    onAdd,
    icon,
    className = "",
}: {
    onAdd: () => void
    icon: IconNamesProps["name"]
    className?: string
}) => {
    return (
        <div className={cx("float-button", className)} onClick={onAdd}>
            <Icon name={icon} color="#fff" height={"30px"} width={"30px"} />
        </div>
    )
}

export default FloatButon
