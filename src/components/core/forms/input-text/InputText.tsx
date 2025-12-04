import { useRef, useState } from "react"
import cx from "classnames"
import Icon from "@/icons"
import { useEffectMouseDown } from "@/hooks/useMouseDown"
import { InputTextProps } from "./InputText.type"
import styles from "./InputText.module.css"

function InputText({
    className = "",
    containerClassName = "",
    label = "",
    error = false,
    errorHintText = "",
    hintText = "",
    value = "",
    onChange,
    icon = "",
    type = "text",
    ...rest
}: InputTextProps) {
    const [localType, setLocalType] = useState<HTMLInputElement["type"]>(type)
    const ref = useRef<HTMLDivElement>(null)

    useEffectMouseDown(ref, () => handleFocus(false))

    const handleFocus = (focus: boolean): void => {
        if (ref.current !== null) {
            if (focus) {
                ref.current.style.boxShadow = "0px 0px 0px 4px #f4ebff"
            } else {
                ref.current.style.boxShadow = "none"
            }
        }
    }

    function getLowercaseFirstLetter(text: string) {
        if (!text) return ""
        const value = text.trim()
        return `${value?.charAt(0)?.toLowerCase() + value?.slice(1)}`?.replace(/\s/g, "")
    }

    return (
        <div className={cx(styles["input-text__container"], containerClassName)}>
            {label && <span className={styles["input-text__label"]}>{label}</span>}
            <div
                ref={ref}
                className={cx({
                    [styles["input-text__box"]]: true,
                    [styles["input-text__box-value"]]: value && !error,
                    [styles["input-text__box-error"]]: error,
                    [className]: className,
                })}
                onClick={() => handleFocus(true)}
            >
                {icon && (
                    <Icon
                        name={icon}
                        height={20}
                        width={20}
                        color={error ? "var(--error)" : "var(--tipografa)"}
                        className={styles["input-text__icon"]}
                    />
                )}
                <input
                    className={cx({
                        [styles["input-text__core"]]: true,
                        [styles["input-text__core-error"]]: error,
                    })}
                    style={{ paddingLeft: icon ? "42px" : "14px" }}
                    value={value}
                    onChange={(e) => {
                        const rawValue =
                            type === "email" ? getLowercaseFirstLetter(e.target.value) : e.target.value
                        const nextValue = onChange(rawValue)

                        if (typeof nextValue === "string") {
                            e.target.value = nextValue
                        }
                    }}
                    type={localType}
                    {...rest}
                />
                {type === "password" && (
                    <Icon
                        name={localType === "password" ? "EyeOff" : "EyeOn"}
                        height={16}
                        width={16}
                        color={error ? "var(--error)" : "var(--tipografa)"}
                        className={cx(styles["input-text__icon"], styles["input-text__icon-password"])}
                        onClick={() => setLocalType(localType === "password" ? "text" : "password")}
                    />
                )}
            </div>
            {hintText || errorHintText ? (
                <span
                    className={cx(
                        styles["input-text__label"],
                        styles["input-text__hint"],
                        error ? styles["input-text__hint-error"] : ""
                    )}
                >
                    {hintText || errorHintText}
                </span>
            ) : null}
        </div>
    )
}

export default InputText
