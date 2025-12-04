import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/Avatar"
import styles from './StaffGroupItem.module.css'
import IconBorder from "@/components/core/general/icon-border/IconBorder"
import UserFill from "@/icons/UserFill"

const StaffGroupItem = ({title, subtitle, src}: {title: string, subtitle: string, src?: string}) => {
  return (
    <div className="w-full flex gap-x-[32px] items-center">
        <Avatar size={32}>
            <AvatarImage src={src} />
            <AvatarFallback>
                <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={30}>
                    <UserFill color="var(--primary)" width={20} height={20} />
                </IconBorder>
            </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <span className={styles["staff-group__item__title"]}>{title}</span>
            <span className={styles["staff-group__item__subtitle"]}>{subtitle}</span>
        </div>
    </div>
  )
}

export default StaffGroupItem