const formatTime = (value: number) => {
    const hours = Math.floor(value)
    const decimals = value - hours

    // Los decimales representan minutos en base 100 (ej: .47 = 47 min)
    const minutes = Math.round(decimals * 100)

    return `${hours * 60 + minutes} minutos`
}

export default formatTime
