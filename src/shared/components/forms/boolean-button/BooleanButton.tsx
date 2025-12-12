import React, { useState } from "react"
import "./BooleanButton.css"
import { Button } from "../button/Button"
import { BooleanButtonProps } from "./boolean-botton"

export const BooleanButton: React.FC<BooleanButtonProps> = ({
    onChange,
    value,
    className,
    textTrue,
    textFalse,
    label,
    classButtons,
}) => {
    const [isTrue, setIsTrue] = useState(value || false)
    return (
        <div className={className || "boolean-button"}>
            {label && <label className="boolean-button__label">{label}</label>}
            <div className="boolean-button__container">
                <Button
                    type={"button"}
                    style={{ width: "6rem" }}
                    className={classButtons || ""}
                    theme={!isTrue ? "primary" : "secondary"}
                    text={textFalse || "NO"}
                    onClick={() => {
                        setIsTrue(false)
                        onChange && onChange(false)
                    }}
                />
                <Button
                    type={"button"}
                    style={{ width: "6rem" }}
                    className={classButtons || ""}
                    theme={isTrue ? "primary" : "secondary"}
                    text={textTrue || "SI"}
                    onClick={() => {
                        setIsTrue(true)
                        onChange && onChange(true)
                    }}
                />
            </div>
        </div>
    )
}
