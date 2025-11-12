import "./avatar.css"
import Verified from "./icons/verified"
import Company from "./icons/company"
import User from "./icons/user"
import OnlineIcon from "./icons/online"
import Clean from "./icons/clean"
import Maintenance from "./icons/maintenance"
import Orden from "./icons/orden"
import { CSSProperties } from "react"

export interface AvatarProps {
    // URL de la imagen de avatar
    src: string
    // Tamaño del avatar, en píxeles
    size: SizeAvatar | string
    // Estado de carga de la imagen
    state: AvatarState
    // Indica si el usuario está en línea
    avatarIconState: AvatarIconState
    // Nombres 0 el Nombre 1 apellidó
    name?: string[]

    style?: CSSProperties

    marco?: boolean
}

export enum AvatarState {
    Loading = "loading",
    Loaded = "loaded",
    Error = "error",
}

export enum AvatarIconState {
    online = "online",
    offline = "offline",
    verified = "verified",
    company = "company",
    clean = "clean",
    maintenance = "maintenance",
    none = "none",
    orden = "orden",
}

export enum SizeAvatar {
    "2xl",
    "xl",
    "lg",
    "md",
    "sm",
    "xs",
}

const Avatar = ({ src, size, state, avatarIconState, name, style, marco }: AvatarProps) => {
    const firtKey = name?.[0]?.charAt(0)
    const secondKey = name?.[1]?.charAt(0)
    return (
        <div className={`avatar ${marco ? "marco" : ""}`} style={style}>
            {state === AvatarState.Loading && <User className={`avatar__icon avatar-${size}`} />}
            {state === AvatarState.Error && (
                <span className={`avatar__font avatar__font--${size} avatar-${size}`}>{`${firtKey}${secondKey}`}</span>
            )}
            {src && state === AvatarState.Loaded && (
                <img className={`avatar__img avatar-${size}`} src={src} alt="Avatar" />
            )}
            {avatarIconState === AvatarIconState.online && <OnlineIcon className={`state state-${size}`} />}
            {avatarIconState === AvatarIconState.offline && <span className={`state offline state-${size}`}></span>}
            {avatarIconState === AvatarIconState.verified && <Verified className={`state state-${size}`} />}
            {avatarIconState === AvatarIconState.company && <Company className={`state state-${size}`} />}
            {avatarIconState === AvatarIconState.maintenance && <Maintenance className={`state state-${size}`} />}
            {avatarIconState === AvatarIconState.clean && <Clean className={`state state-${size}`} />}
            {avatarIconState === AvatarIconState.orden && <Orden className={`state state-${size}`} />}
            {avatarIconState === AvatarIconState.none && null}
        </div>
    )
}

export default Avatar
