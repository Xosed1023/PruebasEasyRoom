import { CSSProperties, forwardRef, Ref, useEffect, useState } from "react"
import { InputTextSuggestion } from "../InputTextSuggestions"
import "./Suggestions.css"
import Suggestion from "../Suggestion/Suggestion"

export interface SuggestionsProps {
    suggestions: (string | InputTextSuggestion)[]
    dropdownStyle?: CSSProperties
    onChange: (value: string | InputTextSuggestion) => void
    setSowSuggestions: (value: boolean) => void
    setInputValue: (value: string) => void
    updateInputTextValueOnSelectItem: boolean
    onBottomReached?: () => void
    visible: boolean
}

const Suggestions = forwardRef(
    (
        {
            suggestions,
            dropdownStyle,
            onChange,
            setSowSuggestions,
            updateInputTextValueOnSelectItem,
            setInputValue,
            visible,
            onBottomReached,
        }: SuggestionsProps,
        ref?: Ref<HTMLUListElement>
    ) => {
        const onClick = (suggestion: string | InputTextSuggestion) => {
            setSowSuggestions(false)
            if (typeof suggestion === "string") {
                if (updateInputTextValueOnSelectItem) {
                    setInputValue(suggestion)
                }
                onChange?.(suggestion)
            } else {
                if (updateInputTextValueOnSelectItem) {
                    setInputValue(suggestion.title)
                }
                onChange?.(suggestion)
            }
        }

        const [visibility, setVisibility] = useState<"hidden" | "initial">("hidden")

        useEffect(() => {
            if (visible) {
                setVisibility("initial")
            } else {
                return setVisibility("hidden")
            }
        }, [visible])

        return (
            <ul
                ref={ref}
                className="inputText-suggestions__list"
                style={{
                    ...dropdownStyle,
                    visibility,
                }}
                onScroll={(e) => {
                    const r = ref as any
                    if (r.current) {
                        const isAtBottom = r.current.scrollHeight - r.current.scrollTop === r.current.clientHeight
                        if (isAtBottom) {
                            onBottomReached?.()
                        }
                    }
                }}
            >
                {suggestions.map((suggestion, index) => (
                    <Suggestion
                        key={typeof suggestion === "string" ? suggestion : suggestion.id}
                        onClick={onClick}
                        suggestion={suggestion}
                    />
                ))}
            </ul>
        )
    }
)

export default Suggestions
