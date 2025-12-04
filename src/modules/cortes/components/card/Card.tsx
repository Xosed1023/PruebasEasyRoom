import { cn } from "@/lib/utils"
import styles from "./Card.module.css"
import { HTMLAttributes } from "react"

const Card = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn(styles.cortes__card, className)} {...props}>
            {children}
        </div>
    )
}

export default Card
