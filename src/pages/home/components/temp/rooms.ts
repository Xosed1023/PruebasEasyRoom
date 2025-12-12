export const rooms1_15 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index: number) => ({
    name: "Nombre largo de habitacion para saber si truenan los estilos",
    status: "free",
    number: index + 1,
}))

export const rooms16_35 = [...rooms1_15, ...rooms1_15, 1, 1, 1, 1, 1].map((item, index: number) => ({
    name: "Nombre largo de habitacion para saber si truenan los estilos",
    status: "free",
    number: index + 1,
}))

export const rooms36_48 = [...rooms16_35, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index: number) => ({
    name: "Nombre largo de habitacion para saber si truenan los estilos",
    status: "free",
    number: index + 1,
}))

export const rooms49_80 = [...rooms36_48, ...rooms1_15, ...rooms1_15, 1, 1].map((item, index: number) => ({
    name: "Nombre largo de habitacion para saber si truenan los estilos",
    status: "free",
    number: index + 1,
}))

export const rooms81_120 = [...rooms49_80, ...rooms16_35, 1, 1, 1, 1, 1].map((item, index: number) => ({
    name: "Nombre largo de habitacion para saber si truenan los estilos",
    status: "free",
    number: index + 1,
}))
