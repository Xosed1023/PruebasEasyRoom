import { memo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleDrawerWidget, toggleProfileDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"
import Icon from "src/shared/icons"
import { OptionsProps } from "./Header.types"
import Drawer from "../../layout/drawer/Drawer"
import closeAllDrawers from "src/shared/hooks/closeAllDrawers"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import "./Header.css"

export const Logo = memo(() => {
    const location = useLocation()
    const navigate = useNavigate()
    const { closeDrawers, resetToInitialStates } = closeAllDrawers()
    const paths = location.pathname.split("/")

    return (
        <img
            src={require("src/assets/png/logo.png")}
            height={35}
            alt="logo"
            onClick={() => {
                if (paths.length > 2 && paths[1] === "u") {
                    navigate("/u")
                }
                if (paths[2] !== "empty-state") {
                    resetToInitialStates()
                    closeDrawers()
                }
            }}
            className="header__logo"
        />
    )
})

export const Options = memo(({ items = [], user, onLogout = undefined }: OptionsProps) => {
    const { isProfileDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const dispatch = useDispatch()
    const { rolName } = useProfile()

    const toggleProfileDrawerState = (value: boolean) => {
        dispatch(toggleProfileDrawer(value))
    }

    const hanldeClick = (callaback: any) => {
        toggleProfileDrawerState(false)
        toggleDrawerWidget(false)
        callaback()
    }

    const location = useLocation()
    const paths = location.pathname.split("/")

    return (
        <>
            <div className="header__options" onClick={() => toggleProfileDrawerState(!isProfileDrawerOpen)}>
                <Icon name={"menu"} className="header__options__icon" color={"var(--white)"} />
            </div>
            <Drawer
                className="header-sidebar"
                bgClassName="header-sidebar__bg"
                placement={"right"}
                bar={false}
                visible={isProfileDrawerOpen}
                onClose={() => toggleProfileDrawerState(false)}
            >
                <div className="header-sidebar__head">
                    <Icon
                        className="header-sidebar__close"
                        name={"close"}
                        onClick={() => toggleProfileDrawerState(false)}
                    />
                    <div className="header-sidebar__head__info">
                        {paths[2] !== "empty-state" && (
                            <img
                                className="header-sidebar__head__avatar"
                                height={56}
                                width={56}
                                src={user.avatar}
                                alt="avatar"
                            />
                        )}
                        <p className="header-sidebar__head__label">
                            <strong className="header-sidebar__head__label__text">{user.name}</strong>
                            <span className="header-sidebar__head__label__text">{user.email}</span>
                        </p>
                    </div>
                </div>
                <div className="header-sidebar__main">
                    <div className="header-sidebar__block">
                        {paths[2] !== "empty-state" &&
                            items?.map(({ label = "", icon = "", onClick }, index) => (
                                <div className="header-sidebar__item" key={index} onClick={() => hanldeClick(onClick)}>
                                    <Icon name={icon} color="var(--white)" />

                                    <span>{label}</span>
                                </div>
                            ))}
                    </div>
                    <div>
                        {rolName === RoleNames.valet && (
                            <div
                                className="header-sidebar__disponibilidad"
                                onClick={() => window.open("/fullscreen/disponibilidad", "_blank")}
                            >
                                <Icon color={"var(--white)"} height={16} width={16} name={"computerFill"} />
                                <span>{"Proyectar  disponibilidad"}</span>
                            </div>
                        )}
                        <div className="header-sidebar__item" onClick={() => hanldeClick(onLogout)}>
                            <Icon name={"logout"} />
                            <span>{"Cerrar sesión"}</span>
                        </div>
                    </div>
                </div>
                <div className="header-sidebar__footer">
                    <img src={require("src/assets/png/logo_opacity.png")} height={26} alt="logo" />
                </div>
            </Drawer>
        </>
    )
})
