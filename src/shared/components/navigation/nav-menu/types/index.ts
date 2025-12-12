import { ComponentProps } from "src/types/component"
import { NavMenuItem } from "./item"

export interface NavMenuProps extends ComponentProps {
    routes: NavMenuItem[]
    value: string
    onChange: (value: string) => void
}
