import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Icon from "src/shared/icons"
import "./MultiHotelLoader.css"
import BgBlur from "src/shared/components/layout/BgBlur/BgBlur"

interface MultiHotelLoaderProps {
    isOpen?: boolean
}

export const MultiHotelLoader = ({ isOpen = false }: MultiHotelLoaderProps) => {
    const [isOpenState, setIsOpenState] = useState(isOpen)
    const [currentIcon, setCurrentIcon] = useState<"fill" | "two">("fill")

    useEffect(() => {
        setIsOpenState(isOpen)
    }, [isOpen])

    useEffect(() => {
        if (isOpenState) {
            const interval = setInterval(() => {
                setCurrentIcon((prev) => (prev === "fill" ? "two" : "fill"))
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isOpenState])

    const portal = createPortal(
        <>
            <BgBlur visible={isOpenState} />
            <div className="multihotel-loader-modal-overlay">
                <div className="multihotel-loader-modal">
                    <div className="multihotel-loader-icon-wrapper">
                        <Icon
                            name={currentIcon === "fill" ? "buildingFill" : "buildingTwo"}
                            color="var(--primary)"
                            width={112}
                            height={100}
                            className="multihotel-loader-icon"
                        />
                    </div>
                    <div className="multihotel-loader-text">Cambiando de hotel...</div>
                </div>
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    )

    return isOpenState ? portal : null
}
