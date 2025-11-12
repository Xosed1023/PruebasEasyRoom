import cx from "classnames"
import Icon from "src/shared/icons"
import { NavMenuProps } from "./types"
import "./NavMenu.css"

const isActivePath = (menuPath: string, currentPath: string): boolean => {
    if (menuPath === currentPath) return true;
    if (menuPath === "/u/reservaciones/table" && currentPath.startsWith("/u/reservaciones/")) {
        return true;
    }
    return false;
};

const NavMenu = ({ className = "", value = "", onChange, routes = [] }: NavMenuProps): JSX.Element => {
    const handleClick = (path: string) => {
        if (path !== value) onChange(path)
    }

    return (
        <section className={cx("nav-footer-bar", className)}>
            <div className="nav-footer-bar_container">
                {routes.map(({ path, label, icon, primary }, index) =>
                    primary ? (
                        <div className="nav-footer__primary" key={index} onClick={() => handleClick(path)}>
                            <Icon name={icon} color={"var(--white)"} height={36} width={36} />
                        </div>
                    ) : (
                        <div className={"nav-footer__item"} key={index} onClick={() => handleClick(path)}>
                            <Icon
                                name={icon}
                                color={`${isActivePath(path, value) ? "var(--header)" : "var(--menu)"}`}
                                height={"18px"}
                                width={"18px"}
                                style={{ marginBottom: 4 }}
                            />
                            <span
                                className={`nav-footer__item__span${isActivePath(path, value) ? " nav-footer__item--active" : ""}`}
                            >
                                {label}
                            </span>
                        </div>
                    )
                )}
            </div>
        </section>
    )
}

export default NavMenu
