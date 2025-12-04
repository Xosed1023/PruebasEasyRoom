import { Badge } from "@/components/ui/Badge/Badge"
import StaffGroupItem from "../staff-group-item/StaffGroupItem"
import { StaffGroupProps } from "./StaffGroup.type"

import styles from './StaffGroup.module.css'

const StaffGroup = ({ title, items, badgeColors }: StaffGroupProps) => {
    return (
        <div className="w-full flex flex-col gap-y-[20px]">
            <div className="flex justify-between"> 
                <span className={styles["staff__group__title"]}>{title}</span>
                <Badge style={{
                    color: badgeColors.text,
                    backgroundColor: badgeColors.bg,
                    border: "none"
                }} >
                    {items.length}
                </Badge>
            </div>
            {items.length ? (
                <>
                    {items.map((i, index) => (
                        <StaffGroupItem key={index} title={i.title} subtitle={i.subtitle} src={i.src} />
                    ))}
                </>
            ) : (
                <StaffGroupItem title="Sin personal asignado" subtitle="No hay personal con tareas en curso" />
            )}
        </div>
    )
}

export default StaffGroup
