import React from "react"
import Icon from "src/shared/icons"
import { IconNamesProps } from "src/shared/icons/Icon"
import "./HeaderIcon.css"
import cx from "classnames"
interface HeaderIconProps {
    icon: IconNamesProps["name"]
    title?: string
    subTitle?: string
    className?: string
}
const HeaderIcon = ({ icon, title, subTitle, className }: HeaderIconProps) => {
    return (
        <section className={cx("icon-header__container", className)}>
            <div className="icon-header">
                <Icon className="icon-header__icon" color="var(--primary)" name={icon} />
            </div>
            {!!title && <h2 className="icon-header__title">{title}</h2>}
            {!!subTitle && <p className="icon-header__subtitle">{subTitle}</p>}
        </section>
    )
}

export default HeaderIcon
