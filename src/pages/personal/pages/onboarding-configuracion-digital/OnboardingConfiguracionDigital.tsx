import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import "./OnboardingConfiguracionDigital.css"
import { infoOnboarding, infoOnboardingTitle } from "./OnboardingConfiguracionDigital.type"

import ModalPin from "./components/modal-pin/ModalPin"
import ModalFingerprint from "./components/modal-fingerprint/ModalFingerprint"
import { useDigitalAuth } from "src/pages/personal/pages/onboarding-configuracion-digital/hooks/useDigitalAuth"

import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import Screen from "src/shared/components/layout/screen/Screen"

const OnboardingConfiguracionDigital = () => {
    const formValue = useMemo(() => JSON.parse(sessionStorage.getItem("personalFormFalues") || "{}"), [])

    const nombreColaborador = formValue.nombre && formValue.apellido_paterno
        ? `${formValue.nombre} ${formValue.apellido_paterno}`
        : "Colaborador no seleccionado"

    const [currentStep] = useState(0)
    const steps = [infoOnboarding]
    const navigate = useNavigate()
    const {
        openModalPin,
        openModalPinFingerprint,
        handlePinSave,
        handleFingerprintSave,
        isModalRegistroPinOpen,
        isModalFingerprintOpen,
        setIsModalRegistroPinOpen,
        setIsModalFingerprintOpen,
    } = useDigitalAuth({
        mode: "onboarding",
        colaboradorNameSelected: nombreColaborador,
    })

    return (
        <Screen onClose={() => navigate(-1)} title="" close contentClassName="onboarding__wrapper">
            <div className="onboarding__container">
                <div className="onboarding__steps" style={{ transform: `translateX(-${currentStep * 100}%)` }}>
                    {steps.map((step, index) => (
                        <div key={index} className={`onboarding__step ${index === currentStep ? "active" : ""}`}>
                            <section className="onboarding__content">
                                <div className="onboarding__info">
                                    {infoOnboardingTitle.map((info, index) => (
                                        <div className="onboarding__info__title-section" key={index}>
                                            <p className="onboarding__info__title">{info.title}</p>
                                            <p className="onboarding__info__subtitle">{info.subtitle}</p>
                                        </div>
                                    ))}
                                    {step.map((info, index) => (
                                        <div className="onboarding__info__step-section" key={index}>
                                            <div className="onboarding__icon">
                                                <Icon
                                                    name={info.icon}
                                                    color={"var(--purple-drawer-primario)"}
                                                    width={24}
                                                    height={24}
                                                />
                                            </div>
                                            <div className="onboarding__info__text-section">
                                                <p className="onboarding__info__title">{info.title}</p>
                                                <p className="onboarding__info__subtitle">{info.subtitle}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        text="Registrar PIN y huella dactilar"
                                        className="onboarding__button-huella"
                                        onClick={openModalPinFingerprint}
                                    />
                                    <Button
                                        text="Registrar solo PIN"
                                        className="onboarding__button-pin"
                                        onClick={openModalPin}
                                    />
                                    <p className="onboarding__info__subtitle" id="text">
                                        *Los permisos de cada puesto pueden ser editados en configuración del hotel.
                                    </p>
                                </div>
                            </section>
                        </div>
                    ))}
                </div>
                <img
                    className="onboarding__image"
                    src={require("src/assets/png/onboarding-huella.png")}
                    alt="logo"
                />
            </div>

            <ModalPin
                isOpen={isModalRegistroPinOpen}
                onClose={() => setIsModalRegistroPinOpen(false)}
                onPinSave={handlePinSave}
                colaboradorName={nombreColaborador}
            />

            <ModalFingerprint
                mode="register"
                isOpen={isModalFingerprintOpen}
                onClose={() => setIsModalFingerprintOpen(false)}
                onButtonClickFingerprint={handleFingerprintSave}
                colaboradorName={nombreColaborador}
            />
        </Screen>
    )
}

export default OnboardingConfiguracionDigital
