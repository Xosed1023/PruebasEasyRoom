import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    tabList?: TabList[]
    fullscreen?: boolean
    value: string
    darkMode?: boolean
    showNumerOnNoItems?: boolean
    customRef?: React.RefObject<HTMLElement>
    onChange?: (value: string) => void
}

export type TabList = {
    label: string
    number?: number
    path: string
}
