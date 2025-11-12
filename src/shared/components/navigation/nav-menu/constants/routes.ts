export const baseRoutes = [
    {
        path: "/u",
        label: "Habitaciones",
        icon: "building4Fill",
    },
    {
        path: "/u/reservaciones/table",
        label: "Reservaciones",
        icon: "bookRemix",
    },
    {
        path: "/u/room-service-home",
        label: "Room Service",
        icon: "restaurantFill",
    },
    {
        path: "/u/personal",
        label: "Personal",
        icon: "accountBoxFill",
    },
]

export const baseSinReservasRoutes = baseRoutes.filter((route) => route.path !== "/u/reservaciones/table")

export const valetRoutes = [
    baseRoutes[0], //Habitaciones
    baseRoutes[1], //Reservaciones
]
export const roomServiceRoutes = [
    baseRoutes[0], //Habitaciones
    baseRoutes[1], //Reservaciones
    {
        ...baseRoutes[2], //Room Service
        icon: "Order",
    },
]
//Para los hoteles que tengan el modulo restaurante
export const restaurantRoutes = [
    baseRoutes[1], //Reservaciones
    baseRoutes[3], //Personal
    {
        path: "/u",
        label: "Habitaciones",
        icon: "BedFilled",
        primary: true,
    },
    {
        ...baseRoutes[2],
        icon: "Bell",
    },
    {
        path: "/u/restaurante-home",
        label: "Restaurante",
        icon: "restaurantFill",
    },
]
//Para los perfiles de restaurantes
export const restauranteRoutes = [
    {
        path: "/u/restaurante-home",
        label: "Restaurante",
        icon: "restaurantFill",
    },
    baseRoutes[1], //Reservaciones
    {
        ...baseRoutes[2],
        icon: "Bell",
    },
]
//Para roll de mantenimiento
export const mantenimientoRoutes = [baseRoutes[0], baseRoutes[1]]
//Para los perfiles de monitoreo
export const monitoreoRoutes = [
    baseRoutes[0], //Habitaciones
    baseRoutes[1], //Reservaciones
    {
        path: "/u/restaurante-home",
        label: "Restaurante",
        icon: "restaurantFill",
    },
    baseRoutes[3], //Personal
]
