import { ReactNode } from "react"
import styles from "./WrapperMobile.module.css"

export interface WrapperMobileProps {
    children?: ReactNode
}

const WrapperMobile = ({ children }: WrapperMobileProps) => {
    return <div className={styles["wrapper-mobile"]}>{children}</div>
}

export default WrapperMobile
