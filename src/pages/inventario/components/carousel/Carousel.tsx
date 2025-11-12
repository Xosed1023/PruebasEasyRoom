import React, { useState } from "react"
import "./Carousel.css" // Puedes definir tus estilos CSS en este archivo
import { infoEmpty, infoEmpty2 } from "../../constants/inventory"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"

const Carousel = ({ onConfirm }: { onConfirm: () => void }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const slides = [infoEmpty, infoEmpty2]

    const handleDotClick = (index: number) => {
        setCurrentSlide(index)
    }

    return (
        <div className="inventarios__carousel">
            <p className="inventario_empty__subtitle">
                Aquí te ayudaremos a organizar y gestionar eficientemente todos los artículos e insumos de tu negocio.
            </p>
            <div className="inventarios__slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div key={index} className={`inventarios__slide ${index === currentSlide ? "active" : ""}`}>
                        <section className="inventario_empty__container">
                            <img
                                className="error-screen-img"
                                src={require(index === 0
                                    ? "src/assets/png/Onboarding_1.png"
                                    : "src/assets/png/Onboarding_2.png")}
                                width={523}
                                height={497}
                                alt="logo"
                            />
                            <div className="inventario_empty_right">
                                {slide.map((info, index) => (
                                    <div className="inventario_empty_section" key={index}>
                                        <div className="inventario_empty_icon">
                                            <Icon name={info.icon} />
                                        </div>
                                        <p className="inventario_empty_title">{info.title}</p>
                                        <p className="inventario_empty_subtitle">{info.subtitle}</p>
                                    </div>
                                ))}
                                <Button
                                    text={index === 0 ? "Siguiente" : "Entendido"}
                                    className="inventario_empty_button"
                                    onClick={() =>
                                        index === 0 ? handleDotClick(1) : onConfirm()
                                    }
                                />
                            </div>
                        </section>
                    </div>
                ))}
            </div>

            <div className="inventarios__indicators">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`inventarios__dot ${index === currentSlide ? "active" : ""}`}
                        onClick={() => handleDotClick(index)}
                    ></span>
                ))}
            </div>
        </div>
    )
}

export default Carousel
