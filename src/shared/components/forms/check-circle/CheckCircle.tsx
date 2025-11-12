import React, { useState, useRef } from "react"
import { useEffectClickOutside } from "src/shared/hooks"
import "./CheckCircle.css"

export interface CheckCircleProps {
    checked: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void
}

const CheckCircle: React.FC<CheckCircleProps> = ({ checked, disabled, onChange }) => {
    // Estado para controlar si el círculo está marcado o no
    const [isChecked, setIsChecked] = useState(checked)

    // Estado para controlar si el círculo está enfocado
    const [isFocus, setIsFocus] = useState(false)

    // Referencia al input del checkbox
    const inputRef = useRef<HTMLInputElement>(null)

    // Referencia al div que representa el checkmark
    const checkmarkRef = useRef<HTMLDivElement>(null)

    // Función que se ejecuta al hacer clic en el círculo
    const onDisabled = () => {
        // Si no está deshabilitado, cambia el estado de enfoque, marcado o no marcado
        if (!disabled) {
            setIsFocus(true)
            setIsChecked(!isChecked)
            if (inputRef.current) {
                // Enfocar el input del checkbox cuando se hace clic en el círculo
                inputRef.current.focus()
            }
        }
    }

    // Efecto para manejar el clic fuera del componente y desenfocar
    useEffectClickOutside(inputRef, () => {
        setIsFocus(false)
    })

    return (
        <label className="check-circle">
            <input
                type="checkbox"
                checked={isChecked}
                onClick={() => setIsFocus(true)}
                ref={inputRef}
                onChange={onChange && (() => setIsFocus(true))}
            />
            <div
                onClick={onDisabled}
                ref={checkmarkRef}
                className={`${!disabled ? "check-circle__checkmark" : "check-circle__checkmark--disabled"} 
        ${!isChecked ? "" : "check-circle__checkmark--unchecked"}
        ${isFocus && !disabled ? "check-circle__checkmark--focus" : ""} `}
            ></div>
        </label>
    )
}

export default CheckCircle
