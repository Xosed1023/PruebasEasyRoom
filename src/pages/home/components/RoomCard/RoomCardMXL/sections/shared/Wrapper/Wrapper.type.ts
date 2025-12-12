import { ReactNode } from "react"

export interface WrapperProps {
  children: ReactNode
  bgColor?: string
  alertBgColor1?: string | null
  alertBgColor2?: string | null
  className?: string
  style?: React.CSSProperties
}
