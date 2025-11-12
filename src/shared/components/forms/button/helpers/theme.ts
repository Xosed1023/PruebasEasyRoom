import { MutableRefObject } from "react"
import { Theme } from "../types/theme.type"

export const selectThemeClass = (theme: Theme) => {
    switch (theme) {
        case "primary":
            return "button--primary"
        case "primary-resumen":
            return "button--primary-resumen"
        case "secondary":
            return "button--secondary"
        case "secondary-gray":
            return "button--secondary-gray"
        case "tertiary":
            return "button--tertiary"
        case "tertiary-gray":
            return "button--tertiary-gray"
    }
}

export const setStyleByTheme = (theme: Theme, ref: MutableRefObject<HTMLButtonElement | null>) => {
    if (!ref.current) {
        return
    }
    switch (theme) {
        case "primary-resumen":
            ref.current.style.outline = "3px solid var(--pale-lilac)"
            ref.current.style.outline = "3px solid rgba(0, 0, 0, 0.15)"
            return
        case "secondary":
            ref.current.style.border = "1px solid #E9D7FE"
            ref.current.style.outline = "3px solid #F4EBFF"
            return
        case "secondary-gray":
            ref.current.style.border = "1px solid #D0D5DD"
            ref.current.style.outline = "3px solid #F2F4F7"
            return
        case "tertiary":
            ref.current.style.border = "1px solid #E9D7FE"
            ref.current.style.outline = "3px solid #F4EBFF"
            ref.current.style.background = "var(--lilac)"
            return
        case "tertiary-gray":
            ref.current.style.border = "1px solid #D0D5DD"
            ref.current.style.outline = "3px solid #F2F4F7"
            ref.current.style.color = "#475467"
            return
    }
}
