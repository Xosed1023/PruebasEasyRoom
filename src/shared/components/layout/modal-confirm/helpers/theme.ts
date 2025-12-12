import { IconTheme } from "../types/theme.type"

export const selectIconThemeClass = (theme: IconTheme = 'black') => {
    switch (theme) {
        case "danger":
            return "modal--confirm__icon-button--danger"
        case "success":
            return "modal--confirm__icon-button--success"
        default:
            return "modal--confirm__icon-button--black"
    }
}
