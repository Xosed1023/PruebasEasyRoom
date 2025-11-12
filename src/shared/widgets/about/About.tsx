import { Fragment, useState } from "react"
import cx from "classnames"
import InfoCircle from "src/shared/icons/InfoCircle"
import CloseWhite from "src/shared/icons/CloseWhite"

import "./About.css"

type AboutProps = {
    className?: string
    items: {
        title: string
        description: string
    }[]
}

type ButtonProps = {
    className?: string
    onClick: () => void
    icon: "close" | "info"
}

const Button = ({ onClick, icon, className }: ButtonProps) => (
    <div className={cx("about-card__btn", className)} onClick={onClick}>
        {icon === "info" ? <InfoCircle height={16} width={16} /> : <CloseWhite height={12} width={12} />}
    </div>
)

function About({ className = "", items = [] }: AboutProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <Fragment>
            <Button className="about-card__btn-open" onClick={() => setVisible(true)} icon={"info"} />
            <div
                className={cx({
                    "about-card": true,
                    "about-card--visible": visible,
                    "about-card--not-visible": !visible,
                    [className]: className,
                })}
            >
                <Button className="about-card__btn-close" onClick={() => setVisible(false)} icon={"close"} />
                <div className="about-card__container">
                    {items.map(({ title = "", description = "" }, index) => (
                        <div key={index} className="about-card__item">
                            <p className="about-card__item__title">{title}</p>
                            <p className="about-card__item__description">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    )
}

export default About
