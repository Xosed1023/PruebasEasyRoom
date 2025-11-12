import { forwardRef, Ref, useRef } from "react"
import { mergeRefs } from "src/shared/helpers/merge-refs"
import { useEffectClickOutside } from "src/shared/hooks"
import "./ButtonIcon.css"
import { ButtonIconProps } from "./types/button-icon.props"
import Icon from "src/shared/icons"

export const ButtonIcon = forwardRef((props: ButtonIconProps, ref: Ref<HTMLButtonElement>) => {
    const { iconName, iconProps, disabled, theme = "primary", ...rest } = props
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    useEffectClickOutside(buttonRef, () => {
        if (buttonRef.current) {
            buttonRef.current.style.border = ""
            buttonRef.current.style.outline = ""
        }
    })

    return (
        <button
            ref={mergeRefs(buttonRef, ref)}
            {...{
                ...rest,
                style: {
                    height: "40px",
                    width: props?.width ? props.width : "40px",
                },
                disabled: disabled,
                className: `${props.className ? props.className : ""} button-icon ${
                    theme === "primary" ? "button-icon--primary" : "button-icon--secondary"
                }`,
                onMouseEnter: (e) => {
                    props.onMouseEnter?.(e)
                },
                onMouseLeave: (e) => {
                    props.onMouseLeave?.(e)
                },
            }}
        >
            <div
                style={{
                    height: "20px",
                    width: "20px",
                }}
            >
                <Icon
                    {...{
                        name: iconName,
                        className: "button-icon__icon",
                        color: theme === "primary" ? "" : "var(--primary)",
                        ...iconProps,
                    }}
                />
            </div>
        </button>
    )
})
