import cx from "classnames"
import Icon from "src/shared/icons"
import { InputTabItem, InputTabsProps } from "./InputTabs.type"
import "./InputTabs.css"

function InputTabs({
    className = "",
    containerClassName = "",
    style = {},
    label = "",
    items = [],
    value = "",
    onChange,
    withCheckOnSelected,
    disabled = false
}: InputTabsProps) {
    const valueIsArray = Array.isArray(value)

    const isActive = (item: InputTabItem) => (valueIsArray ? value.find((v) => item.value === v) : item.value === value)

    return (
        <div className={cx("input-tabs", containerClassName)} style={style}>
            {label && <p className="input-tabs__label">{label}</p>}
            <div className={cx("input-tabs__content", className)}>
                {items.map((item, index) => (
                    <div
                        className={cx({
                            "input-tab": true,
                            "input-tab--active": isActive(item),
                            "input-tab--disabled": item.disabled || disabled,
                        })}
                        key={index}
                        onClick={
                            !item.disabled
                                ? () => {
                                    if(!isActive(item)) {
                                        onChange(item.value)
                                        return
                                    }
                                    if(valueIsArray) {
                                        onChange(value.find((v) => v !== item.value) || "")
                                        return
                                    }
                                    onChange("")
                                }
                                : undefined
                        }
                    >
                        {item.bigLabel && (
                            <span
                                className="input-tabs__label--big"
                                style={{
                                    color: isActive(item) ? "var(--purple-drawer-primario)" : "var(--tipografa)",
                                }}
                            >
                                {item.bigLabel}
                            </span>
                        )}
                        {item.icon && (
                            <Icon
                                name={item.icon}
                                width={16}
                                height={16}
                                color={isActive(item) ? "var(--purple-drawer-primario)" : "var(--tipografa)"}
                            />
                        )}
                        <span className="input-tabs__tab-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InputTabs
