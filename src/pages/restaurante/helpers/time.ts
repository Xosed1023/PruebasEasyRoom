const getLabel = (number: number): string => `${number}`.padStart(2, "0")

export function getTimeElements(date: Date | string) {
    const diff = new Date().getTime() - new Date(date).getTime()

    const hours = Math.abs(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
    const minutes = Math.abs(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
    const seconds = Math.abs(Math.floor((diff % (1000 * 60)) / 1000))

    return {
        hours: getLabel(hours),
        minutes: getLabel(minutes),
        seconds: getLabel(seconds),
    }
}
