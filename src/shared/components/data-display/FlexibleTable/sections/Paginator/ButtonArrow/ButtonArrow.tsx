import "./ButtonArrow.css"
import Icon from "src/shared/icons"

export interface ButtonArrowProps {
    onClick: (from: "left" | "right") => void
    from: "left" | "right"
    disabled: boolean
}

const ButtonArrow = ({ onClick, from, disabled }: ButtonArrowProps) => {
    return (
        <div onClick={() => !disabled && onClick(from)} className={"paginator__button-arrow"}>
            {from === "right" ? (
                <Icon
                    className={` ${disabled ? "paginator__button-arrow--disabled" : ""}`}
                    name="ArrowRightFull"
                    width={20}
                    height={20}
                />
            ) : (
                <Icon
                    className={` ${disabled ? "paginator__button-arrow--disabled" : ""}`}
                    name="ArrowLeftFull"
                    width={20}
                    height={20}
                />
            )}
        </div>
    )
}

export default ButtonArrow
