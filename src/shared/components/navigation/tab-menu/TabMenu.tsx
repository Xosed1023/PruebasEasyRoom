import cx from "classnames"
import { Props } from "./TabMenu.types"
import "./TabMenu.css"

function TabMenu({
    className = "",
    style = {},
    tabList = [],
    value = "",
    fullscreen = false,
    onChange = undefined,
    customRef = undefined,
    showNumerOnNoItems = false,
    darkMode = false,
}: Props): JSX.Element {
    const handleClick = (path: string) => {
        if (onChange) onChange(path)
    }

    return (
        <section
            ref={customRef}
            className={cx({
                "tab-menu": true,
                "tab-menu--fullscreen": fullscreen,
                [className]: className,
            })}
            style={style}
        >
            {tabList?.map(({ label = "", number = 0, path = "" }, index) => (
                <div
                    tabIndex={0}
                    className={cx({
                        "tab-menu__item": !darkMode,
                        "tab-menu__item--active": !darkMode && value === path,
                        "tab-menu--dark__item": darkMode,
                        "tab-menu--dark__item--active": darkMode && value === path,
                    })}
                    onClick={() => handleClick(path)}
                    key={index}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleClick(path)
                        }
                    }}
                >
                    <p className={cx({ "tab-menu__item__label": true, "tab-menu--dark__item__label": darkMode })}>
                        {label}
                    </p>
                    {(number > 0 || (showNumerOnNoItems && number === 0)) && <span className="tab-menu__item__badge">{number}</span>}
                </div>
            ))}
        </section>
    )
}

export default TabMenu
