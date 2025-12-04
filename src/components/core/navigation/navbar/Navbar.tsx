import cx from "classnames"
import Icon from "@/icons"
import { NavbarProps } from "./Navbar.type"
import styles from "./Navbar.module.css"

function Navbar({ className = "", style = {}, items = [], onChange, ...props }: NavbarProps) {
    return (
        <div className={cx(styles["navbar"], className)} style={style}>
            {items.map(({ label = "", icon = "", value = "", activeIcon = "", path = "" }, index) => {
                const selected = value == props.value
                return (
                    <div key={index} className={cx(styles["navbar__item"])} onClick={() => onChange(path)}>
                        <div
                            className={cx({
                                [styles["navbar__dot"]]: selected,
                                [styles["navbar__box"]]: !selected,
                            })}
                        >
                            {selected ? (
                                activeIcon ? (
                                    <Icon height={18} width={18} name={activeIcon} color={"var(--white)"} />
                                ) : (
                                    <Icon
                                        height={18}
                                        width={18}
                                        name={icon}
                                        color={"var(--primary)"}
                                        secondarycolor={"var(--white)"}
                                    />
                                )
                            ) : (
                                <Icon height={24} width={24} name={icon} color={"#BEBEBE"} />
                            )}
                        </div>
                        {selected && <span className={styles["navbar__label"]}>{label}</span>}
                    </div>
                )
            })}
        </div>
    )
}

export default Navbar
