import { ReactNode } from "react"
import styles from "./Screen.module.css"
import { cn } from "@/lib/utils"

const Screen = ({
    children,
    header,
    className,
    footer,
    padding = true,
}: {
    children: ReactNode
    header?: ReactNode
    className?: string
    footer?: ReactNode
    padding?: boolean
}) => {
    return (
        <div className={styles.screen__wrapper}>
            {header && <div className={styles.header}>{header}</div>}
            <div
                className={cn(styles.screen, padding ? "s:px-[35px] xs:px-[20px]" : "", className)}
                style={{
                    height: `calc(calc(100dvh - ${header ? "72px" : 0}) - ${
                        footer ? "calc(84px + env(safe-area-inset-bottom, 0px))" : 0
                    })`,
                    ...(footer ? { paddingBottom: "calc(90px + env(safe-area-inset-bottom, 0px))" } : {}),
                }}
            >
                {children}
            </div>
            {footer}
        </div>
    )
}

export default Screen
