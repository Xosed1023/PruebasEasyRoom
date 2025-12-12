import cx from "classnames"
import Touchable from "../../general/touchable/Touchable"
import CardUser from "../cart-user/CartUser"
import { Props } from "./CardStaff.type"
import "./CardStaff.css"

function CardStaff({
    className = "",
    style = {},
    name = "",
    picture = "",
    description = "",
    status = "online",
    text = "",
    active = false,
    disabled = false,
    onClick = undefined,
}: Props): JSX.Element {
    return (
        <Touchable
            className={cx({ "card-staff": true, "card-staff_space_text": !!text, [className]: className })}
            theme={"dark"}
            active={active}
            style={style}
            onClick={onClick}
            disabled={disabled}
        >
            <CardUser
                className="card-staff__avatar"
                name={name}
                picture={picture}
                description={description}
                status={status}
                textColor={"var(--white)"}
                size={"sm"}
                text={text}
            />
        </Touchable>
    )
}

export default CardStaff
