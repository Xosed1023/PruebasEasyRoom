import { HTMLAttributes } from "react"

import styles from "./Card.module.css"
import { cn } from "@/lib/utils"

const Card = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn(styles.card, className)} {...props}>{children}</div>
}

export default Card
