import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps, OptionsProps {
    hotel: {
        name: string
        avatar: string
    }
    showDrawer: boolean 
    onClickNoch: () => void
}

export type OptionsProps = {
    items: {
        label: string
        icon: string
        onClick: () => void
    }[]
    user: {
        name: string
        email: string
        avatar: string
    }
    onLogout?: () => void
}
