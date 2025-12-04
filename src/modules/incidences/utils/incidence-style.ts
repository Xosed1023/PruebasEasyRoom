export const getIncidenceStyle = (
  origin: string = ""
): { icon: string; bgColor: string; iconColor: string } => {
  const lowerOrigin = origin.toLowerCase()

  switch (lowerOrigin) {
    case "instalaciones":
      return {
        icon: "Building",
        bgColor: "#FDEFCB",
        iconColor: "#DC6803",
      }
    case "habitaciones":
      return {
        icon: "BedRoom",
        bgColor: "#F3EFFF",
        iconColor: "#7F56D9",
      }
    case "huésped":
    case "huesped":
      return {
        icon: "UserIncidences",
        bgColor: "#CEF4FC",
        iconColor: "#8FA3BF",
      }
    default:
      return {
        icon: "AlertTriangle",
        bgColor: "#FFEAEA",
        iconColor: "#FF5630",
      }
  }
}
