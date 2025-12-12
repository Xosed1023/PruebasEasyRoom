import React from "react"
import Avatar, { AvatarProps } from "../avatar/avatar"
import "./AvatarGroup.css"

interface AvatarGroupProps {
    avatarList: AvatarProps[]
    maxAvatars: number
}
const AvatarGroup = ({ avatarList, maxAvatars }: AvatarGroupProps) => {
    const overflowAvatars = avatarList.length - maxAvatars

    return (
        <div className="avatarGroup">
            {renderAvatars(avatarList.slice(0, maxAvatars))}
            {overflowAvatars > 0 && <div className="avatarGroup__extra marco">+{overflowAvatars}</div>}
        </div>
    )
}

const renderAvatars = (avatarList: AvatarProps[]) => {
    return avatarList.map((avatar, index) => (
        <Avatar
            key={index}
            state={avatar.state}
            avatarIconState={avatar.avatarIconState}
            src={avatar.src}
            name={avatar.name}
            size={"sm"}
            style={{ marginRight: "-12px" }}
            marco={avatar.marco}
        />
    ))
}

export default AvatarGroup
