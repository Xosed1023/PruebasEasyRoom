import React from "react"

import "./AboutUs.css"
import { Modal } from "src/shared/components/layout/modal/Modal"

const AboutUs = () => {
    return (
        <Modal width={500} maxHeight={"80vh"} isOpen className="about-us" isCancelableOnClickOutside={false}>
            <p className="about-us__title">¡Bienvenido a easyroom!</p>
            <p className="about-us__text">
                Sistema de gestión hotelera diseñada para hacer que toda la operación de tu hotel sea ¡Increíblemente
                fácil!
            </p>
            <p className="about-us__text">
                easyroom ofrece amplias funcionalidades para registrar y gestionar cada aspecto de tu hotel o motel en
                un solo lugar, de manera eficiente y efectiva.
            </p>
            <p className="about-us__text">
                Desde la venta de habitaciones, gestión de venta y compra de artículos, Room Service, control de
                inventarios y hasta el registro de tareas, easyroom proporciona herramientas intuitivas y fáciles de
                usar que te permiten llevar un seguimiento detallado de todas las transacciones y actividades diarias.
            </p>
            <p className="about-us__text">
                Con una interfaz amigable y funcionalidades personalizables, adaptadas a las necesidades específicas de
                tu hotel, easyroom es la solución ideal para optimizar tus operaciones y mejorar la experiencia de tus
                huéspedes.
            </p>

            <p className="about-us__text">Entre las características principales de easyroom se incluyen:</p>
            <ul className="about-us__list">
                <li className="about-us__text">
                    <span className="about-us__text--bold">Registro de venta de habitaciones:</span> Mantén un registro detallado de todas las reservas y ventas de
                    habitaciones, con la capacidad de gestionar tarifas, disponibilidad y preferencias de los huéspedes.
                </li>
                <li className="about-us__text">
                    <span className="about-us__text--bold">Room Services:</span> Facilita la solicitud y entrega de servicios de habitación, desde alimentos y bebidas
                    hasta artículos de tocador, con un sistema de seguimiento en tiempo real para garantizar la
                    satisfacción del cliente.
                </li>
                <li className="about-us__text">
                    <span className="about-us__text--bold">Control de inventarios:</span> Administra de manera eficiente los niveles de inventario de tu hotel, con
                    herramientas para realizar pedidos, rastrear entregas y evitar faltantes o excedentes.
                </li>
                <li className="about-us__text">
                    <span className="about-us__text--bold">Informes y análisis:</span> Accede a informes detallados y análisis de datos que te ayudarán a tomar
                    decisiones informadas para mejorar la eficiencia operativa y aumentar la rentabilidad de tu hotel.
                </li>
            </ul>
            <p className="about-us__text">
                En resumen, easyroom es la herramienta integral que necesitas para llevar tu hotel al siguiente
                nivel. ¡Únete a nosotros y descubre cómo easyroom puede hacer que la gestión de tu hotel sea
                verdaderamente fácil y exitosa!
            </p>
        </Modal>
    )
}

export default AboutUs
