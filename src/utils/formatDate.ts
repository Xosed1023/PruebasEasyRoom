 export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }

  const locale = "es-ES"
  const formattedDate = date.toLocaleDateString(locale, optionsDate)
  const formattedTime = date.toLocaleTimeString(locale, optionsTime)

  return `${formattedDate} a las ${formattedTime}`
}

export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}
