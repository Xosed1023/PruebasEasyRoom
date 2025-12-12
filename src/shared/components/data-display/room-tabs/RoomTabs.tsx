import { memo } from "react"
import cx from "classnames"
import { ItemTabsProps, RoomTabsProps } from "./RoomTabs.type"
import "./RoomTabs.css"

const Item = memo(
    ({
        className = "",
        style = {},
        label = "",
        timer = "",
        active = false,
        onClick = undefined,
    }: ItemTabsProps): JSX.Element => {
        return (
            <div
                className={cx({ "room-tab": true, "room-tab--state--active": active, [className]: className })}
                style={style}
                onClick={onClick}
            >
                <span className="room-tab__title" style={timer ? {} : {
                    maxWidth: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                }}>{label}</span>
                {timer && <span className="room-tab__time">{timer}</span>}
            </div>
        )
    }
)

function RoomTabs(props: RoomTabsProps): JSX.Element {
    const { className = "", style = {}, items = [] } = props
    return (
        <div className={cx("room-tabs", className)} style={style}>
            {items?.map(({ label = "", timer = "", value = "" }, index) => (
                <Item
                    key={index}
                    label={label}
                    timer={timer}
                    active={value === props.value}
                    onClick={() => props.onChange(value)}
                />
            ))}
        </div>
    )
}

RoomTabs.Item = Item

export default RoomTabs
