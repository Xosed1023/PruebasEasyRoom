import { AvatarFallback } from "@/components/ui/avatar/Avatar"
import { AvatarStack } from "@/components/ui/avatar/AvatarStack"
import { StaffItemProps } from "./StaffItem.type"
import IconBorder from "@/components/core/general/icon-border/IconBorder"

import styles from './StaffItem.module.css'

const StaffItem = ({ avatars, bgIconColor, icon, title }: StaffItemProps) => {
    return (
        <div className="flex w-full justify-between">
            <div className="flex gap-x-[27px]">
            <IconBorder primaryBgColor={bgIconColor} primaryBgDiameter={24}>
                {icon}
            </IconBorder>
            <span className={styles["staff-item__label"]}>{title}</span>
            </div>
            <AvatarStack
                avatarSize={34}
                maxAvatarsAmount={2}
                avatars={avatars}
                noAvatarLengthFallback={<AvatarFallback>0</AvatarFallback>}
            />
        </div>
    )
}

export default StaffItem
