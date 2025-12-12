import React, { useState } from "react"
import InputRange from "../InputRange/InputRange"
import Icon from "src/shared/icons"

import './InputRangeButtons.css'

const InputRangeButtons = ({ onSliderChange }: { onSliderChange: (value: number) => void }) => {
    const [percentage, setPercentage] = useState(50) // Initial value

    const handleClick = (v: number) => {
        if((percentage + v) <= 0) {
            setPercentage(0)
            return
        }
        if((percentage + v) >= 100) {
            setPercentage(100)
            return
        }
        setPercentage((p) => p + v)
    }

    return (
        <div className="image-editor__slider__buttons">
            <Icon name="ZoomOut" color="var(--primary)" className="image-editor__slider__button" onClick={() => handleClick(-10)} />
            <InputRange onSliderChange={onSliderChange} percentage={percentage} setPercentage={setPercentage} />
            <Icon name="ZoomIn" color="var(--primary)" className="image-editor__slider__button" onClick={() => handleClick(10)} />
        </div>
    )
}

export default InputRangeButtons
