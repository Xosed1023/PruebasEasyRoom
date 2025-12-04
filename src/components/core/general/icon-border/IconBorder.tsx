import { ReactNode } from "react"
import styles from "./IconBorder.module.css"

const IconBorder = ({
    children,
    primaryBgColor,
    primaryBgDiameter,
    secondaryBgColor,
    secondaryBgDiameter,
    className,
}: {
    children?: ReactNode
    primaryBgColor: string
    primaryBgDiameter: number | string
    secondaryBgColor?: string
    secondaryBgDiameter?: number | string
    className?: string
}) => {
    return (
        <>
            {!!secondaryBgColor || !!secondaryBgDiameter ? (
                <div
                    className={`${styles["icon-border-center"]} ${className || ""}`}
                    style={{
                        backgroundColor: secondaryBgColor,
                        height: secondaryBgDiameter,
                        width: secondaryBgDiameter,
                    }}
                >
                    <div
                        className={styles["icon-border-center"]}
                        style={{ backgroundColor: primaryBgColor, height: primaryBgDiameter, width: primaryBgDiameter }}
                    >
                        {children}
                    </div>
                </div>
            ) : (
                <div
                    className={`${styles["icon-border-center"]} ${className || ""}`}
                    style={{ backgroundColor: primaryBgColor, height: primaryBgDiameter, width: primaryBgDiameter }}
                >
                    {children}
                </div>
            )}
        </>
    )
}

export default IconBorder
