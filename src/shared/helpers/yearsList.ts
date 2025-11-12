export const getYearsList = (): number[] => {
    const anioActual: number = new Date().getFullYear()
    const anios: number[] = []

    for (let i = 1900; i <= anioActual; i++) {
        anios.push(i)
    }

    return anios.reverse()
}
