import { useEffect, useRef } from "react"
import cx from "classnames"
import BgBlur from "../BgBlur/BgBlur"
import Icon from "src/shared/icons"
import DropdownMenu from "../../data-display/dropdown-menu/DropdownMenu"
import { Props } from "./Drawer.types"
import "./Drawer.css"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"

function Drawer({
    className = "",
    style = {},
    bgClassName = "",
    bgStyle = {},
    visible = false,
    children = null,
    placement = "top",
    bar = true,
    withCloseButton = false,
    withBackButton = false,
    withMenu = false,
    onBack = undefined,
    onClose = undefined,
    onClickMenu = undefined,
    itemsMenu = [],
    config = {
        left: "101%",
        top: "-115%",
    },
}: Props): JSX.Element {
    const ref = useRef<HTMLElement>(null)
    const { rolName } = useProfile()

    useEscapeKey({
        onEscape: () => {
            onClose?.()
        },
    })

    useEffect(() => {
        if (null !== ref.current) {
            if (visible) {
                ref.current.style.transform = placement === "top" ? "translate3d(0, 0%, 0)" : "translate3d(0%, 0, 0)"
            } else {
                ref.current.style.transform =
                    placement === "top" ? `translate3d(0, ${config.top}, 0)` : `translate3d(${config.left}, 0, 0)`
            }
        }
    }, [visible])

    // const closeAnimation = () => {
    //     setAnimationClose(true)
    //     setTimeout(() => {
    //         onClose
    //     }, 300)
    // }

    return (
        <>
            <BgBlur className={bgClassName} visible={visible} onClose={onClose} />
            <section
                ref={ref}
                className={cx({
                    drawer__content: true,
                    drawer__top: placement === "top",
                    drawer__right: placement === "right",
                    [className]: className,
                })}
                style={style}
            >
                {withBackButton && (
                    <Icon
                        className="drawer__back-button"
                        name={"ArrowLeftFull"}
                        color="var(--white)"
                        onClick={onBack}
                        width={26}
                        height={26}
                    />
                )}
                <div className="drawer__contain__top-right">
                    {withMenu &&
                        rolName !== RoleNames.valet &&
                        rolName !== RoleNames.roomService &&
                        rolName !== RoleNames.monitoreo && (
                        <DropdownMenu items={itemsMenu}>
                            <Icon
                                className="drawer__menu-button"
                                name={"menuDots"}
                                color="var(--white)"
                                onClick={onClickMenu}
                                width={24}
                                height={24}
                            />
                        </DropdownMenu>
                    )}
                    {withCloseButton && (
                        <Icon
                            className="drawer__close-button"
                            name={"close"}
                            color="var(--white)"
                            width={24}
                            height={24}
                            onClick={onClose}
                        />
                    )}
                </div>
                <div className="drawer__main">{children && children}</div>
            </section>
        </>
    )
}

export default Drawer
