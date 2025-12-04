import { Separator } from "../separator/Separator"

import styles from "./DrawerItem.module.css"

const DrawerItem = ({ title, description, separator }: { title: string; description: string; separator?: boolean }) => {
    return (
        <div className="flex flex-col">
            <h5 className={styles["drawer-item__title"]}>{title}</h5>
            <p className={styles["drawer-item__descrption"]}>{description}</p>
            {separator && <Separator className="mt-[10px]" />}
        </div>
    )
}

export default DrawerItem
