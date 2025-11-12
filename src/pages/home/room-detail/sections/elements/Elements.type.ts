import { ReactNode, CSSProperties } from "react"
import { ComponentProps } from "src/types/component"
import { TextBoxProps } from "src/shared/components/forms/text-box/types/text-box.props"
import { Props as TabMenuProps } from "src/shared/components/navigation/tab-menu/TabMenu.types"

export interface TitleProps {
    className?: string
    children: string
    link?: string
    onLink?: () => void
}

export interface LinkProps extends TitleProps {
    onClick?: () => void
}

export interface TextLineProps {
    className?: string
    label: string
    value: string
    fontWeight?: number
}

export interface BlockProps extends ComponentProps {
    children: ReactNode | ReactNode[]
    list?: boolean
    scroll?: boolean
}

export type TabsProps = Omit<TabMenuProps, "darkMode">

export type TextAreaProps = TextBoxProps

export interface TouchableBoldCardProps {
    onClick: () => void
    title: string
    subtitle: string
    active?: boolean
    className?: string
    style?: CSSProperties
    titleStyle?: CSSProperties
    subtitleStyle?: CSSProperties
}

export type ToastProps = {
    title: string
    text: string
    isOpen?: boolean
    onClose: () => void
    status: "success" | "error" | ""
    className?: string
}
