import { IconNamesProps } from "src/shared/icons/Icon"

export type NavMenuItem = {
    label: string
    path: string
    icon: IconNamesProps["name"]
    primary?: boolean
}
