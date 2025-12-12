import React, { useState, useEffect } from "react"
import "./TimerProgressCard.css"

type TimerComponentProps = {
    title: string
    fechaRegistro: string
}

const TimerProgressCard: React.FC<TimerComponentProps> = ({ title, fechaRegistro }) => {
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        const registroDate = new Date(fechaRegistro)

        const updateElapsedTime = () => {
            const now = new Date()
            const diffInSeconds = Math.floor((now.getTime() - registroDate.getTime()) / 1000)
            setElapsedTime(diffInSeconds)
        }

        updateElapsedTime()
        const timer = setInterval(updateElapsedTime, 1000)

        return () => clearInterval(timer)
    }, [fechaRegistro])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0")
        const secs = (seconds % 60).toString().padStart(2, "0")
        return `${minutes}:${secs}`
    }

    const progressPercentage = Math.min((elapsedTime / (30 * 60)) * 100, 100)

    const getProgressColor = () => {
        if (elapsedTime < 15 * 60) return "#408232"
        if (elapsedTime < 25 * 60) return "#E8C23D"
        return "#DC3737"
    }

    const titleTextMap = {
        en_preparacion: "Orden en preparación",
        por_entregar: "Orden por entregar",
        en_entrega: "En entrega",
    }

    return (
        <div className="timer-progress-card__component">
            <div className="timer-progress-card__title">{titleTextMap[title] || ""}</div>
            <div className="timer-progress-card__container" style={{ position: "relative" }}>
                <div
                    className="timer-progress-card__background"
                    style={{
                        width: "100%",
                        height: 7,
                        backgroundColor: "white",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        borderRadius: 20,
                    }}
                ></div>
                <div
                    className="timer-progress-card__progress"
                    style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: getProgressColor(),
                        height: 7,
                        position: "relative",
                        zIndex: 1,
                        borderRadius: 20,
                    }}
                ></div>
                <div
                    className="timer-progress-card__time"
                    style={{
                        position: "absolute",
                        left: `${progressPercentage}%`,
                        transform: "translateX(-50%)",
                        top: "8px",
                        whiteSpace: "nowrap",
                    }}
                >
                    {formatTime(elapsedTime)}
                </div>
            </div>
        </div>
    )
}

export default TimerProgressCard
