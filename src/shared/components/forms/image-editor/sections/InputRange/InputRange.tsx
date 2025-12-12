import React, { useState, useRef, useEffect } from "react"

import "./InputRange.css"

const InputRange = ({
    onSliderChange,
    percentage,
    setPercentage,
}: {
    onSliderChange: (value: number) => void
    percentage: number
    setPercentage: (value: number) => void
}) => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const sliderFillRef = useRef<HTMLDivElement>(null)
    const sliderThumbRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (sliderFillRef.current && sliderThumbRef.current) {
            sliderFillRef.current.style.width = `${percentage}%`
            sliderThumbRef.current.style.left = `${percentage}%`
        }
        onSliderChange(Number((((percentage / 100) + 0.5)).toFixed(2)))
    }, [percentage])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && sliderRef.current) {
                const rect = sliderRef.current.getBoundingClientRect()
                let offsetX = e.clientX - rect.left

                if (offsetX < 0) offsetX = 0
                if (offsetX > rect.width) offsetX = rect.width

                const newPercentage = (offsetX / rect.width) * 100
                setPercentage(newPercentage)
                onSliderChange(Number((((newPercentage / 100) + 0.5)).toFixed(2)))
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging])

    const handleMouseDown = () => {
        setIsDragging(true)
    }

    const handleSliderClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (sliderRef.current) {
            const rect = sliderRef.current.getBoundingClientRect()
            let offsetX = e.clientX - rect.left

            if (offsetX < 0) offsetX = 0
            if (offsetX > rect.width) offsetX = rect.width

            const newPercentage = (offsetX / rect.width) * 100
            setPercentage(newPercentage)
        }
    }

    return (
        <div className="slider" ref={sliderRef} onClick={handleSliderClick}>
            <div
                className="slider-fill"
                ref={sliderFillRef}
                style={{
                    width: `${percentage}%`,
                }}
            ></div>
            <div
                className="slider-thumb"
                ref={sliderThumbRef}
                onMouseDown={handleMouseDown}
                style={{
                    left: `${percentage}%`,
                }}
            ></div>
        </div>
    )
}

export default InputRange
