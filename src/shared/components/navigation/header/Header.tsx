import cx from "classnames"
import { useLocation } from "react-router-dom"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useHotelSession } from "src/shared/hooks/useHotelSession"
import { MultiHotelLoader } from "src/pages/home/components/MultiHotelLoader/MultiHotelLoader"
import { useHover } from "./components/drop-hotel/DropHotel.hook"
import DropHotel from "./components/drop-hotel/DropHotel"
import ChevronUp from "src/shared/icons/ChevronUp"
import { Logo, Options } from "./Header.sections"
import { Props } from "./Header.types"
import "./Header.css"

function Header({
    className = "",
    style = {},
    items = [],
    hotel,
    user,
    onLogout = undefined,
    onClickNoch,
    showDrawer,
}: Props): JSX.Element {
    const location = useLocation()
    const paths = location.pathname.split("/")
    const { rolName } = useProfile()
    return (
        <header className={cx("header", className)} style={style}>
            <Logo />
            {paths[2] !== "empty-state" && !(rolName === RoleNames.cocina || rolName === RoleNames.roomService) && (
                <div
                    className={`header__notch`}
                    style={{ display: `${showDrawer ? "none" : ""}` }}
                    onClick={onClickNoch}
                >
                    <div className="header__notch__bar"></div>
                </div>
            )}
            <div className="header__right">
                {paths[2] !== "empty-state" && <HeaderHotel name={hotel?.name} avatar={hotel?.avatar} />}
                <Options items={items} user={user} onLogout={onLogout} />
            </div>
        </header>
    )
}

function HeaderHotel({ name = "", avatar = "" }) {
    const { isHovered, contentRef, triggerRef, setIsHovered } = useHover()
    const { handleChangeHotel, loading } = useHotelSession()

    const { hoteles } = useProfile()

    return (
        <>
            <div className="header__info" {...(hoteles.length > 1 && !loading ? { ref: triggerRef } : {})}>
                <p className="header__info__label">{name}</p>
                <div className="header__container__avatar">
                    <img className="header__info__avatar" height={40} width={40} src={avatar} alt="avatar" />
                    {hoteles.length > 1 && (
                        <div className="header__container__avatar-dot">
                            <ChevronUp color={"var(--white)"} height={7} width={7} />
                        </div>
                    )}
                </div>
                {isHovered && (
                    <DropHotel
                        onChange={(hotel_id: string) => {
                            setIsHovered(false)
                            handleChangeHotel(hotel_id)
                        }}
                        ref={contentRef}
                    />
                )}
                <MultiHotelLoader isOpen={loading} />
            </div>
        </>
    )
}

export default Header
