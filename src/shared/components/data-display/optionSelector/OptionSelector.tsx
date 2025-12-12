import React from "react"
import "./OptionSelector.css"

import { OptionSelectorProps } from "./OptionSelector.type"

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedOption, onOptionChange }) => {
    return (
        <div className="option-selector">
            {options.map((option) => (
                <label key={option.value} className="option-selector__item">
                    <input
                        type="radio"
                        value={option.value}
                        checked={selectedOption === option.value}
                        onClick={() => onOptionChange(option.value)}
                        className="option-selector__input"
                    />
                    <span className="option-selector__label">{option.label}</span>
                    <span
                        className={`option-selector__radio ${
                            selectedOption === option.value ? "option-selector__radio--selected" : ""
                        }`}
                    />
                </label>
            ))}
        </div>
    )
}

export default OptionSelector
