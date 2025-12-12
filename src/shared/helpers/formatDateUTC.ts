export const formatUTCDate = (date: Date, label = "día", abbreviated = false): string => {
    const seconds = Math.abs(Math.floor(date.getTime?.() / 1000))
    const minutes = Math.abs(Math.floor(seconds / 60))
    const hours = Math.abs(Math.floor(minutes / 60))
    const days = Math.abs(Math.floor(hours / 24))

    if (days >= 1) {
        return `${days} ${label}${!abbreviated ? days >= 2 ? "s" : "" : ""}`
    }
    if (hours < 1) {
        const formattedMinutes = String(minutes % 60).padStart(2, "0")
        const formattedSeconds = String(seconds % 60).padStart(2, "0")
        return `${formattedMinutes}:${formattedSeconds}`
    } else {
        const formattedHours = String(hours % 24).padStart(2, "0")
        const formattedMinutes = String(minutes % 60).padStart(2, "0")
        // const formattedSeconds = String(seconds % 60).padStart(2, "0")
        return `${formattedHours}:${formattedMinutes}h`
    }
}
