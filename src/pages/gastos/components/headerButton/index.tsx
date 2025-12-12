import cx from "classnames"
import Icon from "src/shared/icons"
import { useState } from "react"
import { Props } from "./index.types"

export const HeaderButton = ({ icon, onIconClick }: Props): JSX.Element => {
    const [active, setActive] = useState<boolean>(false)

    return (
        <div
            className={cx({
                "gastos-screen__btn": true,
                "gastos-screen__btn--disabled": active !== true,
            })}
            onClick={() => {
                setActive(!active)
                onIconClick
            }}
        >
            <Icon color="#0E0E0E" name={icon} />
        </div>
    )
}
