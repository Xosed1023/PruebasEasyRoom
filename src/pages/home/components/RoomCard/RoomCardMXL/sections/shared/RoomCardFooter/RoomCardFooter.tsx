import React, { InputHTMLAttributes, useEffect, useState } from "react"

import "./RoomCardFooter.css"

interface RoomCardFooterProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "ref"> {
    text: string,
    onSliderTriggered?: () => void
    bgColor?: string
}

const RoomCardFooter = ({ text, onChange, onSliderTriggered, bgColor = 'var(--gray-background)' }: RoomCardFooterProps) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (event) => {
        const newValue = parseFloat(event.target.value);
        setSliderValue(newValue);
        onChange?.(newValue as any);
    };

    useEffect(() => {
        if (!isDragging && sliderValue === 100) {
            onSliderTriggered?.();
        }
        setSliderValue(0)
        onChange?.(0 as any);
    }, [isDragging])


    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="room-card--mxl__custom-slider" style={{ position: 'relative', backgroundColor: bgColor, overflow: 'hidden' }}>
            <div
                className="room-card--mxl__footer__slider__text--dark__wrapper"
                style={{
                    right: `calc(100% - ${sliderValue}%)`,
                    borderRadius: sliderValue > 50 ? '7px' : ''
                }}>
                <span className="room-card--mxl__footer__slider__text--dark">{text}</span>
            </div>
            <input
                style={{ position: 'absolute', top: '-10px' }}
                className="room-card--mxl--slider-input"
                type="range"
                min={0}
                max={100}
                step={1}
                value={sliderValue}
                onChange={handleChange}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            />
            <span className="room-card--mxl__footer__slider__text">{text}</span>
        </div>
    );
}

export default RoomCardFooter
