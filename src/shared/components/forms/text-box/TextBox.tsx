import { ChangeEvent, FocusEvent, forwardRef, MouseEvent, Ref, useRef, useState } from "react"
import { useEffectFocusOutside } from "src/shared/hooks"
import { mergeRefs } from "src/shared/helpers/merge-refs"
import { TextBoxProps } from "./types/text-box.props"
import "./TextBox.css"

export const TextBox = forwardRef((props: TextBoxProps, ref: Ref<HTMLTextAreaElement>) => {
    const {
        description,
        hinttext,
        className,
        error,
        characterLimit = 200,
        errorHintText,
        value,
        onChange,
        onBlur,
        disabled,
        onMouseEnter,
        onMouseLeave,

        ...rest
    } = props

    const [characterCount, setCharacterCount] = useState(value ? String(value)?.length : 0)

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e)
        setCharacterCount(e.target.value.length)
    }

    const [inputFilledAndFocusOut, setInputFilledAndFocusOut] = useState<boolean>()
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

    useEffectFocusOutside(textAreaRef, () => {
        setInputFilledAndFocusOut(!!(textAreaRef && textAreaRef.current?.value))
    })

    const handleOnFocus = () => {
        setIsInputFocused(true)
        setInputFilledAndFocusOut(false)
    }

    const handleOnBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
        onBlur?.(e)
        setIsInputFocused(false)
        setInputFilledAndFocusOut(true)
    }

    const handleOnMouseEnter = (e: MouseEvent<HTMLTextAreaElement>) => {
        onMouseEnter?.(e)
        if (disabled) {
            return
        }
        if (!textAreaRef.current) {
            return
        }
        textAreaRef.current.style.boxShadow = ""
    }

    const handleOnMouseLeave = (e: MouseEvent<HTMLTextAreaElement>) => {
        onMouseLeave?.(e)
        if (disabled) {
            return
        }
        if (!textAreaRef.current) {
            return
        }
        textAreaRef.current.style.boxShadow = ""
    }

    return (
        <>
            <div className="text-box__wrapper">
                <span className="text-box__description">{description}</span>
                <div className="text-box__semi-container">
                    <textarea
                        className={`text-box__main ${error ? "text-box__main--error" : ""} ${
                            className ? className : ""
                        }`}
                        {...{
                            ...rest,
                            disabled,
                            ref: mergeRefs(textAreaRef, ref),
                            onChange: handleOnChange,
                            onMouseEnter: handleOnMouseEnter,
                            onMouseLeave: handleOnMouseLeave,
                            onFocus: handleOnFocus,
                            onBlur: handleOnBlur,
                            value,
                            style: {
                                border: props.style?.border
                                    ? props.style?.border
                                    : error
                                    ? "1px solid var(--pink-coral)"
                                    : !value && !isInputFocused
                                    ? "var(--border-input)"
                                    : isInputFocused
                                    ? "var(--border-input-focus)"
                                    : value && inputFilledAndFocusOut
                                    ? "var(--border-input-select)"
                                    : !inputFilledAndFocusOut
                                    ? "var(--border-input-select)"
                                    : "",
                                ...props.style,
                            },
                        }}
                        maxLength={characterLimit}
                    ></textarea>
                    <span
                        className="text-box__character-limit"
                        style={{
                            color: error
                                ? "var(--red-danger)"
                                : isInputFocused
                                ? "var(--header)"
                                : !inputFilledAndFocusOut
                                ? "var(--slate-gray)"
                                : "",
                        }}
                    >
                        {characterCount}/{characterLimit}
                    </span>
                </div>
                <span
                    className="text-box__hinttext"
                    style={{
                        color: error ? "var(--error)" : "",
                    }}
                >
                    {error ? errorHintText : hinttext}
                </span>
            </div>
        </>
    )
})

export default TextBox
