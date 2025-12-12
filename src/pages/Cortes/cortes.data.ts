export const MODE_CORTES = "admin"

export const tableItems = {
    headers: [
        { value: "#" }, // Columna de números
        {
            value: "Conceptos",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Alquiler de habitación", valueToDisplay: "Alquiler de habitación" },
                { value: "Servicios adicionales", valueToDisplay: "Servicios adicionales" },
                { value: "Alimentación", valueToDisplay: "Alimentación" },
                { value: "Entretenimiento", valueToDisplay: "Entretenimiento" },
            ],
        },
        {
            value: "Categorías",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Hospedaje", valueToDisplay: "Hospedaje" },
                { value: "Transporte", valueToDisplay: "Transporte" },
                { value: "Spa y bienestar", valueToDisplay: "Spa y bienestar" },
                { value: "Gastos de comida", valueToDisplay: "Gastos de comida" },
            ],
        },
        {
            value: "Habitaciones",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Habitación Doble", valueToDisplay: "Habitación Doble" },
                { value: "Suite de lujo", valueToDisplay: "Suite de lujo" },
                { value: "Restaurante del hotel", valueToDisplay: "Restaurante del hotel" },
                { value: "Lavandería del hotel", valueToDisplay: "Lavandería del hotel" },
            ],
        },
        {
            value: "Monto",
            sort: true,
        },
        {
            value: "Método de Pago",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Tarjeta de crédito", valueToDisplay: "Tarjeta de crédito" },
                { value: "Efectivo", valueToDisplay: "Efectivo" },
                { value: "PayPal", valueToDisplay: "PayPal" },
                { value: "Transferencia bancaria", valueToDisplay: "Transferencia bancaria" },
            ],
        },
        {
            value: "Fechas",
            sort: true,
        },
        {
            value: "Responsable",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Juan Pérez", valueToDisplay: "Juan Pérez" },
                { value: "María Rodríguez", valueToDisplay: "María Rodríguez" },
                { value: "Ana Gómez", valueToDisplay: "Ana Gómez" },
                { value: "Luis Torres", valueToDisplay: "Luis Torres" },
            ],
        },
        { value: "Ticket" },
    ],
    rows: [
        {
            value: [
                { value: "1" },
                { value: "Alquiler de habitación" },
                { value: "Hospedaje" },
                { value: "Habitación Doble" },
                { value: "150.00" },
                { value: "Tarjeta de crédito" },
                { value: "23/Dic/2023" },
                { value: "María Rodríguez" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "2" },
                { value: "Servicio de habitación" },
                { value: "Servicios adicionales" },
                { value: "Suite de lujo" },
                { value: "45.00" },
                { value: "Efectivo" },
                { value: "22/Dic/2023" },
                { value: "Juan Pérez" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "3" },
                { value: "Desayuno buffet" },
                { value: "Alimentación" },
                { value: "Restaurante del hotel" },
                { value: "20.00" },
                { value: "Tarjeta de débito" },
                { value: "20/Dic/2023" },
                { value: "Ana Gómez" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "4" },
                { value: "Estacionamiento diario" },
                { value: "Servicios adicionales" },
                { value: "Estacionamiento del hotel" },
                { value: "10.00" },
                { value: "Efectivo" },
                { value: "19/Dic/2023" },
                { value: "Luis Torres" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "5" },
                { value: "Masaje en el spa" },
                { value: "Spa y bienestar" },
                { value: "Spa del hotel" },
                { value: "60.00" },
                { value: "Tarjeta de crédito" },
                { value: "18/Dic/2023" },
                { value: "Laura Martínez" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "6" },
                { value: "Alquiler de sala de conferencias" },
                { value: "Eventos y reuniones" },
                { value: "Sala de conferencias" },
                { value: "200.00" },
                { value: "Transferencia bancaria" },
                { value: "17/Dic/2023" },
                { value: "Carlos Sánchez" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "7" },
                { value: "Cena en el restaurante" },
                { value: "Alimentación" },
                { value: "Restaurante del hotel" },
                { value: "40.00" },
                { value: "Efectivo" },
                { value: "16/Dic/2023" },
                { value: "Elena Díaz" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "8" },
                { value: "Lavandería" },
                { value: "Servicios adicionales" },
                { value: "Lavandería del hotel" },
                { value: "15.00" },
                { value: "Tarjeta de crédito" },
                { value: "15/Dic/2023" },
                { value: "Javier García" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "9" },
                { value: "Acceso al gimnasio" },
                { value: "Fitness y deportes" },
                { value: "Gimnasio del hotel" },
                { value: "25.00" },
                { value: "Efectivo" },
                { value: "14/Dic/2023" },
                { value: "Sofía Ramírez" },
                { value: "" },
            ],
        },
        {
            value: [
                { value: "10" },
                { value: "Tour turístico" },
                { value: "Excursiones" },
                { value: "Recepción del hotel" },
                { value: "30.00" },
                { value: "Tarjeta de débito" },
                { value: "13/Dic/2023" },
                { value: "Pedro López" },
                { value: "" },
            ],
        },
    ],
}

export const fajillasTable = {
    headers: [
        {
            value: "#",
        },
        {
            value: "Fecha",
            sort: true,
        },
        {
            value: "Monto",
            sort: true,
        },
        {
            value: "Entrega",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "En persona", valueToDisplay: "En persona" },
                { value: "Correo", valueToDisplay: "Correo" },
            ],
        },
        {
            value: "Recibe",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Juan Pérez", valueToDisplay: "Juan Pérez" },
                { value: "María Rodríguez", valueToDisplay: "María Rodríguez" },
            ],
        },
        {
            value: "Comentarios",
        },
        {
            value: "Estatus",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Recibida", valueToDisplay: "Activa" },
                { value: "No Recibida", valueToDisplay: "Inactiva" },
            ],
        },
    ],
    row: [
        {
            value: [
                { value: "1" },
                { value: "2023-10-25" },
                { value: "150.00" },
                { value: "En persona" },
                { value: "Juan Pérez" },
                { value: "Entrega exitosa" },

                { value: "Recibida" },
            ],
        },
        {
            value: [
                { value: "2" },
                { value: "2023-10-24" },
                { value: "200.00" },
                { value: "Correo" },
                { value: "María Rodríguez" },
                { value: "Paquete dañado" },

                { value: "Recibida" },
            ],
        },
        {
            value: [
                { value: "3" },
                { value: "2023-10-23" },
                { value: "50.00" },
                { value: "Correo" },
                { value: "Juan Pérez" },
                { value: "Entrega pendiente" },

                { value: "Recibida" },
            ],
        },
        {
            value: [
                { value: "4" },
                { value: "2023-10-22" },
                { value: "100.00" },
                { value: "En persona" },
                { value: "María Rodríguez" },
                { value: "Sin comentarios" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "5" },
                { value: "2023-10-21" },
                { value: "300.00" },
                { value: "En persona" },
                { value: "Juan Pérez" },
                { value: "Pedido especial" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "6" },
                { value: "2023-10-20" },
                { value: "80.00" },
                { value: "Correo" },
                { value: "María Rodríguez" },
                { value: "Sin comentarios" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "7" },
                { value: "2023-10-19" },
                { value: "90.00" },
                { value: "En persona" },
                { value: "Juan Pérez" },
                { value: "Entrega pendiente" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "8" },
                { value: "2023-10-18" },
                { value: "180.00" },
                { value: "En persona" },
                { value: "María Rodríguez" },
                { value: "Entrega exitosa" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "9" },
                { value: "2023-10-17" },
                { value: "220.00" },
                { value: "Correo" },
                { value: "Juan Pérez" },
                { value: "Paquete dañado" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "10" },
                { value: "2023-10-16" },
                { value: "270.00" },
                { value: "Correo" },
                { value: "María Rodríguez" },
                { value: "Pedido especial" },

                { value: "No Recibida" },
            ],
        },
        {
            value: [
                { value: "11" },
                { value: "2023-10-15" },
                { value: "120.00" },
                { value: "En persona" },
                { value: "Juan Pérez" },
                { value: "Entrega pendiente" },

                { value: "No Recibida" },
            ],
        },
    ],
}

export const fajillasAdminTable = {
    headers: [
        {
            value: "#",
        },
        {
            value: "Fecha",
            sort: true,
        },
        {
            value: "Monto",
            sort: true,
        },
        {
            value: "Entrega",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "En persona", valueToDisplay: "En persona" },
                { value: "Correo", valueToDisplay: "Correo" },
            ],
        },
        {
            value: "Recibe",
            filterMenu: [
                { value: "Todas", valueToDisplay: "Todas" },
                { value: "Juan Pérez", valueToDisplay: "Juan Pérez" },
                { value: "María Rodríguez", valueToDisplay: "María Rodríguez" },
            ],
        },
        {
            value: "Comentarios",
        },
        {
            value: "Estatus",
        },
    ],
    row: [
        {
            value: [
                { value: "1" },
                { value: "2023-10-25" },
                { value: "150.00" },
                { value: "En persona" },
                { value: "Juan Pérez" },
                { value: "Entrega exitosa" },

                { value: "Recibir fajilla" },
            ],
        },
        {
            value: [
                { value: "2" },
                { value: "2023-10-24" },
                { value: "200.00" },
                { value: "Correo" },
                { value: "María Rodríguez" },
                { value: "Paquete dañado" },

                { value: "Recibir fajilla" },
            ],
        },
        {
            value: [
                { value: "3" },
                { value: "2023-10-23" },
                { value: "50.00" },
                { value: "Correo" },
                { value: "Juan Pérez" },
                { value: "Entrega pendiente" },

                { value: "Recibida" },
            ],
        },
        {
            value: [
                { value: "4" },
                { value: "2023-10-22" },
                { value: "100.00" },
                { value: "En persona" },
                { value: "María Rodríguez" },
                { value: "Sin comentarios" },

                { value: "Rechazada" },
            ],
        },
        {
            value: [
                { value: "5" },
                { value: "2023-10-21" },
                { value: "300.00" },
                { value: "En persona" },
                { value: "Juan Pérez" },
                { value: "Pedido especial" },

                { value: "Recibida" },
            ],
        },
        {
            value: [
                { value: "6" },
                { value: "2023-10-20" },
                { value: "80.00" },
                { value: "Correo" },
                { value: "María Rodríguez" },
                { value: "Sin comentarios" },

                { value: "Creada" },
            ],
        },
    ],
}

export const CortesAdminTable = {
    headers: [
        {
            value: "Folio",
        },
        {
            value: "Fecha",
        },
        {
            value: "Turno",
        },
        {
            value: "Responsable",
        },
        {
            value: "Recepcionista",
        },
        {
            value: "Total",
        },
        {
            value: "Incidencias",
        },
        {
            value: "Estatus",
        },
    ],
    row: [
        {
            value: [
                { value: "Pendiente" },
                { value: "06/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "-" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrar corte" },
            ],
        },
        {
            value: [
                { value: "Pendiente" },
                { value: "06/Jun/23" },
                { value: "Turno 2 - Vespertino" },
                { value: "-" },
                { value: "Lucía Peña Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrar corte" },
            ],
        },
        {
            value: [
                { value: "Pendiente" },
                { value: "06/Jun/23" },
                { value: "Turno 1 - Matutino" },
                { value: "-" },
                { value: "Larissa Hurtado Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrar corte" },
            ],
        },
        {
            value: [
                { value: "3063" },
                { value: "05/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "Mario Hernadez Hernadez" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrado" },
            ],
        },
        {
            value: [
                { value: "3063" },
                { value: "05/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "Mario Hernadez Hernadez" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrado" },
            ],
        },
        {
            value: [
                { value: "3063" },
                { value: "05/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "Mario Hernadez Hernadez" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrado" },
            ],
        },
        {
            value: [
                { value: "3063" },
                { value: "05/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "Mario Hernadez Hernadez" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrado" },
            ],
        },
        {
            value: [
                { value: "3063" },
                { value: "05/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "Mario Hernadez Hernadez" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrado" },
            ],
        },
        {
            value: [
                { value: "3063" },
                { value: "05/Jun/23" },
                { value: "Turno 3 - Nocturno" },
                { value: "Mario Hernadez Hernadez" },
                { value: "Diana Gúzman Hernadez" },
                { value: "$110,500" },
                { value: "4" },
                { value: "Cerrado" },
            ],
        },
    ],
}

export const incidenciasTable = {
    headers: [
        {
            value: "#",
        },
        {
            value: "Estatus",
        },
        {
            value: "Descripción",
        },
        {
            value: "Severidad",
        },
        {
            value: "Area",
        },
        {
            value: "Habitación",
        },
        {
            value: "Acción",
        },
    ],
    rows: [
        {
            value: [
                { value: "1" },
                { value: "Activa" },
                { value: "Problema con el aire acondicionado" },
                { value: "Media" },
                { value: "Recepción" },
                { value: "Habitación 101" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "2" },
                { value: "Cerrada" },
                { value: "Fuga de agua en el baño" },
                { value: "Alta" },
                { value: "Mantenimiento" },
                { value: "Habitación 205" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "3" },
                { value: "Activa" },
                { value: "Problema con la televisión" },
                { value: "Baja" },
                { value: "Recepción" },
                { value: "Habitación 306" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "4" },
                { value: "Cerrada" },
                { value: "Problema con la llave de la puerta" },
                { value: "Media" },
                { value: "Mantenimiento" },
                { value: "Habitación 102" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "5" },
                { value: "Activa" },
                { value: "Ruido en la habitación vecina" },
                { value: "Baja" },
                { value: "Recepción" },
                { value: "Habitación 207" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "6" },
                { value: "Cerrada" },
                { value: "Problema con la ducha" },
                { value: "Alta" },
                { value: "Mantenimiento" },
                { value: "Habitación 304" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "7" },
                { value: "Activa" },
                { value: "Habitación no limpia" },
                { value: "Baja" },
                { value: "Limpieza" },
                { value: "Habitación 401" },
                { value: "Cerrar incidencia" },
            ],
        },
        {
            value: [
                { value: "8" },
                { value: "Cerrada" },
                { value: "Problema con el minibar" },
                { value: "Media" },
                { value: "Mantenimiento" },
                { value: "Habitación 109" },
                { value: "Cerrar incidencia" },
            ],
        },
    ],
}
