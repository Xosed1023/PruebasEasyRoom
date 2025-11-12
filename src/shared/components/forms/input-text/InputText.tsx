import { ChangeEvent, FocusEvent, forwardRef, Ref, useEffect, useRef, useState } from "react"
//import { IconWarning } from "../../../icons"
import { useEffectFocusOutside } from "src/shared/hooks/handle-focus-outside"

import "./InputText.css"
import { mergeRefs } from "src/shared/helpers/merge-refs"
import IconHelp from "src/shared/icons/InconHelp"
import IconInfo from "src/shared/icons/infoToolTip"
import { InputTextProps } from "./input-text.props"
import Tooltip from "../../data-display/tooltip/Tooltip"
import Icon_ from "src/shared/icons"
import useDescription from "./hooks/useDescription"

export const InputText = forwardRef((props: InputTextProps, ref: Ref<HTMLInputElement>) => {
    const {
        label,
        error,
        hinttext,
        errorhinttext,
        tooltipInput,
        tooltipLabel,
        icon: Icon,
        iconProps = {},
        onBlur,
        onFocus,
        onChange,
        triggerOnChangeOnBlur,
        inputWrapperClass,
        toolTipInfo,
        loader,
        iconPadding = "40px",
        description,
        ...rest
    } = props

    const inputRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLSpanElement>(null)

    const { descriptionWidth } = useDescription({
        description,
        ref: descriptionRef,
    })

    const [isFocused, setIsFocused] = useState<boolean>()
    const [isInputFilled, setIsInputFilled] = useState<boolean>(false)

    useEffect(() => {
        if (rest.value) {
            setIsInputFilled(true)
        } else {
            setIsInputFilled(false)
        }
    }, [rest.value])

    useEffectFocusOutside(inputRef, () => {
        setIsFocused(false)
    })

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        // if (rest.type === "number") {
        //     console.log("e, ", e.target.value)
        // }
        if (triggerOnChangeOnBlur) {
            return
        }

        onChange?.(e)
        if (e.target.value.length) {
            return setIsInputFilled(true)
        }
        setIsInputFilled(false)
    }

    const handleOnFocus = (e: FocusEvent<HTMLInputElement>) => {
        onFocus?.(e)
        setIsFocused(true)
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        if (triggerOnChangeOnBlur) {
            onChange?.(e)
        }
        onBlur?.(e)
        setIsFocused(false)

        if (`${rest.value}`.length === 0) setIsInputFilled(false)
    }

    return (
        <div className={`input-text__container ${inputWrapperClass || ""}`}>
            <label className="input-text__label">
                {label}
                {tooltipLabel && (
                    <Tooltip {...tooltipLabel} theme="dark">
                        <Icon_
                            name={"infoToolTip"}
                            color="var(--primary)"
                            style={{
                                marginLeft: 10,
                                marginTop: "-5px",
                                width: 18,
                                height: 18,
                            }}
                        />
                    </Tooltip>
                )}
            </label>

            <div className="input-text__wrapper">
                <div className="input-text__icon">
                    {Icon && <Icon color="var(--header)" height={16} width={16} {...iconProps} />}
                </div>
                <input
                    {...{
                        ...rest,
                        error: String(error),
                        className: `input-text ${error ? "input-text--error" : ""} ${
                            props.className ? props.className : ""
                        }`,
                        ref: mergeRefs(inputRef, ref),
                        onFocus: handleOnFocus,
                        onChange: handleOnChange,
                        onBlur: handleOnBlur,
                        style: {
                            ...props.style,
                            border: props.style?.border
                                ? props.style?.border
                                : error
                                ? "1px solid var(--pink-ocupado)"
                                : isFocused
                                ? "var(--border-input-focus)"
                                : isInputFilled && !isFocused
                                ? "1px solid var(--header)"
                                : "var(--border-input)",
                            paddingLeft: props.style?.paddingLeft ? props.style?.paddingLeft : Icon ? iconPadding : "",
                            paddingRight: description ? (descriptionWidth + 18) : 0
                        },
                    }}
                />
                {description && (
                    <div className="input-text__description">
                        <span
                            className="input-text__description__text"
                            ref={descriptionRef}
                            style={{ left: -descriptionWidth - 18 }}
                        >
                            {description}
                        </span>
                    </div>
                )}
                {tooltipInput ? (
                    <Tooltip {...tooltipInput}>
                        {toolTipInfo ? <IconInfo /> : <IconHelp color="var(--orchid)" />}
                    </Tooltip>
                ) : null}
                {/*
                error ? (
                    <div className="input-text__icon input-text__icon--helper">
                        <IconWarning color="var(--red-danger)" />
                    </div>
                )
                */}
                {loader && <div className="input__loader" />}
            </div>
            <span className={`input-text__hint ${error ? "input-text__hint--error" : ""}`}>
                {error ? errorhinttext : hinttext}
            </span>
        </div>
    )
})

export default InputText
