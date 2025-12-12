import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import InputText from "../input-text/InputText"
import { InputTextProps } from "../input-text/input-text.props"
import "./InputTextSuggestions.css"
import { useEffectClickOutside } from "src/shared/hooks"
import Suggestions from "./Suggestions/Suggestions"
import { computePosition, flip, shift } from "@floating-ui/react"
import { debounce } from "src/utils/lodash"

export interface InputTextSuggestion {
    title: string
    subtitle?: string
    photoUrl?: string
    id: string
    displaySuggestions?:boolean
}
interface PropsInputTextSuggestions {
    inputTextConfig: InputTextProps
    value: string | InputTextSuggestion | null
    updateInputTextValueOnSelectItem?: boolean
    onChange: (value: string | InputTextSuggestion) => void
    suggestions: string[] | InputTextSuggestion[]
    className?: string
    suggestionsListMaxHeight?: string
    suggestionsListWidth?: string
    lazy?: boolean
    onBottomReached?: (value: string) => void
    onTextChange?: (value: string) => void
    displaySuggestions?: boolean
}

const InputTextSuggestions = ({
    value,
    onChange,
    suggestions,
    inputTextConfig,
    className,
    lazy = false,
    onTextChange,
    updateInputTextValueOnSelectItem = true,
    onBottomReached,
    displaySuggestions = true, 
}: PropsInputTextSuggestions) => {
    const [mode, setMode] = useState<"search" | "select">("search")
    const [inputValue, setInputValue] = useState(typeof value === "string" ? value : value?.title || "")

    useEffect(() => {
        const componentValue = typeof value === "string" ? value : value?.title || ""
        if(lazy && componentValue !== inputValue) {
            setInputValue(componentValue)
        }
    }, [value, inputValue, lazy])

    const [sowSuggestions, setSowSuggestions] = useState(false)

    const inputTextRef = useRef<HTMLDivElement>(null)
    const suggestionsRef = useRef<HTMLUListElement>(null)

    useEffectClickOutside(inputTextRef, () => {
        setSowSuggestions(false)
    })

    // acomodar la lista flotante del dropdown
    useEffect(() => {
        if(!inputTextRef.current || !suggestionsRef.current) {
            return
        }
        computePosition(inputTextRef.current, suggestionsRef.current, {
            placement: "bottom-start",
            middleware: [flip(), shift()]
        }).then(({ x, y }) => {
            Object.assign(suggestionsRef!.current!.style, {
                top: `${y + 5}px`,
                left: `${x}px`,
                width: `${(inputTextRef.current?.getBoundingClientRect().width || 0)}px`
            });
        });

    }, [sowSuggestions, suggestions])

    const filteredSuggestions = useMemo(() => {
        if (!displaySuggestions) {
            return suggestions 
        }

        const inputValueTransformed = inputValue?.toLowerCase().trim()

        return suggestions.filter((option) =>
            typeof option === "string"
                ? option
                    .toLowerCase()
                    .trim()
                    .includes(inputValueTransformed || "")
                : option.title
                    .toLowerCase()
                    .trim()
                    .includes(inputValueTransformed || "")
        )
    }, [inputValue, sowSuggestions, suggestions, displaySuggestions])

    const openSuggestions = () => {
        setSowSuggestions(true)
    }

    const handleBottomReached = () => {
        onBottomReached?.(inputValue || "")
    }

    const handleBlur = useCallback(
        debounce((e: any) => mode !== "select" ? inputTextConfig?.onBlur?.(e) : undefined, 500),
        [mode]
    )

    return (
        <div
            className={className ? className : "inputText-suggestions"}
            style={{ position: "relative" }}
            ref={inputTextRef}
        >
            <Suggestions
                onBottomReached={handleBottomReached}
                visible={!!(sowSuggestions && filteredSuggestions.length)}
                ref={suggestionsRef}
                onChange={(v)=>{
                    onChange(v)
                    setMode("select")
                }}
                setInputValue={setInputValue}
                setSowSuggestions={setSowSuggestions}
                suggestions={filteredSuggestions}
                updateInputTextValueOnSelectItem={updateInputTextValueOnSelectItem}
            />
            <InputText
                onClick={openSuggestions}
                value={inputValue}
                onChange={(e) => {
                    setMode("search")
                    setInputValue(e.target.value)
                    lazy && onTextChange?.(e.target.value) && suggestions.length && setSowSuggestions(true)
                    if (!e.target.value) {
                        onChange("")
                    }
                }}
                {...inputTextConfig}
                onBlur={handleBlur}
            />
        </div>
    )
}

export default InputTextSuggestions
