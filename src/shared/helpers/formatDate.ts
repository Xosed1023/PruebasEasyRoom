export const formatDate = (fecha: Date, format: "/" | "comma" = "/") => {
    if (isNaN(fecha?.getTime?.())) {
        return "- - / - - / - - - -"
    }

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    const dia = fecha.getDate()
    const mes = meses[fecha.getMonth()]
    const anio = fecha.getFullYear()

    switch (format) {
        case "/":
            return `${dia}/${mes}/${anio}`
        case "comma":
            return `${mes}, ${dia} ${anio}`
    }
}
