import React from "react"

import "./ModalContentReception.css"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { formatPaymentPeriodDate } from "src/shared/helpers/formatPaymentPeriodDate"
import { TextBox } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import useSnackbar from "src/shared/hooks/useSnackbar"
import {
    ColaboradorToPayPropina,
    setMontoAcumulado,
    setTotalPagoPropinas,
    toggleIsModalConfirmarPagoPropinaOpen,
} from "src/store/propinas/pagoPropinasSlice"
import { useDispatch } from "react-redux"
import { TiposPagos, usePagar_PropinasMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { add, minus } from "src/shared/helpers/calculator"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const ModalContentReception = ({
    totalPagoPropinas,
    colaboradoresToPayPropinas,
    montoAcumulado,
    limiteDisponible,
    fechasPagoPropinas,
}: {
    totalPagoPropinas: number
    colaboradoresToPayPropinas: ColaboradorToPayPropina[]
    fechasPagoPropinas: Date[]
    montoAcumulado: number
    limiteDisponible: number
}) => {
    const { control, handleSubmit } = useForm()
    const dispatch = useDispatch()
    const [pagarPropinas] = usePagar_PropinasMutation()
    const { hotel_id, usuario_id } = useProfile()
    const { formatCustomDate } = useFormatDate()

    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const onSubmit = (data) => {
        if (isLoading) {
            return
        }

        toggleIsLoading({ value: true })

        const subtotal = colaboradoresToPayPropinas.reduce(
            (acum, current) => add(acum, current.montoAPagar > 0 ? current.montoAPagar : 0),
            0
        )

        pagarPropinas({
            variables: {
                pagar_propinas_input: {
                    hotel_id,
                    usuario_id,
                    caja_chica: true,
                    descripcion: data.comentario,
                    detalles_pago: {
                        subtotal,
                        tipo_pago: TiposPagos.Efectivo,
                    },
                    limite_disponible: limiteDisponible,
                    pagos_propinas: colaboradoresToPayPropinas.map((pp) => ({
                        colaborador_id: pp.id,
                        comision_bancaria_propina_por_venta: pp.comisionPorVentas,
                        comision_bancaria_sobre_fondo: pp.fondo,
                        monto_pagado: pp.montoAPagar,
                        asignacion_propina_id: pp.asignacion_propina_id,
                    })),
                    periodo_pago: `${formatCustomDate(new Date(), "MMM, DD YYYY")} ${formatCustomDate(new Date(), "MMM, DD YYYY")}`,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Propinas pagadas",
                    text: `Se registro un pago de propina a los colaboradores con **un monto de $${totalPagoPropinas}**`,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al pagar propina",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => {
                navigate("/u/propinas")
                dispatch(setTotalPagoPropinas(0))
                dispatch(setMontoAcumulado(0))
                dispatch(toggleIsModalConfirmarPagoPropinaOpen(false))
            })
    }

    return (
        <ModalContent className="pago-propinas-confirm--reception-pago__wrapper">
            <ModalRow style={{ alignItems: "flex-start" }}>
                <IconBorder
                    primaryBgColor="var(--purple-secondary)"
                    primaryBgDiameter={36}
                    secondaryBgDiameter={48}
                    secondaryBgColor={"var(--fondo--close)"}
                >
                    <IconBorder primaryBgColor="var(--primary)" primaryBgDiameter={24}>
                        <Icon name="handCoin" width={17} height={17} color="var(--white)" />
                    </IconBorder>
                </IconBorder>
                <p className="pago-propinas-confirm--reception-pago--reception__title">
                    ¿Deseas realizar el pago de propinas?
                </p>
            </ModalRow>
            <ModalBody>
                <div className="pago-propinas-confirm--reception-pago__labels__wrapper">
                    <div className="pago-propinas-confirm--reception-pago__label__wrapper">
                        <Icon name="HandCoinFilled" color="#000" style={{ marginTop: "5px" }} />
                        <div className="pago-propinas-confirm--reception-pago__label">
                            <span className="pago-propinas-confirm--reception-pago__label__detail">Monto a pagar</span>
                            <span className="pago-propinas-confirm--reception-pago__label__value">
                                {formatCurrency(totalPagoPropinas)}
                            </span>
                        </div>
                    </div>
                    <div className="pago-propinas-confirm--reception-pago__label__wrapper">
                        <Icon name="calendarFill" color="#000" style={{ marginTop: "5px" }} />
                        <div className="pago-propinas-confirm--reception-pago__label">
                            <span className="pago-propinas-confirm--reception-pago__label__detail">
                                Periodo de pago
                            </span>
                            <span className="pago-propinas-confirm--reception-pago__label__value">
                                {formatPaymentPeriodDate(fechasPagoPropinas)}
                            </span>
                        </div>
                    </div>
                    <div className="pago-propinas-confirm--reception-pago__label__wrapper">
                        <Icon name="dollarCircle" color="#000" style={{ marginTop: "5px" }} />
                        <div className="pago-propinas-confirm--reception-pago__label">
                            <span className="pago-propinas-confirm--reception-pago__label__detail">Remanente</span>
                            <span className="pago-propinas-confirm--reception-pago__label__value">
                                {formatCurrency(minus(montoAcumulado || 0, totalPagoPropinas || 0))}
                            </span>
                        </div>
                    </div>
                </div>
                <form
                    style={{ width: "100%" }}
                    id="pago-propinas-confirm--reception-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name="comentario"
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextBox
                                value={value}
                                onChange={onChange}
                                style={{ width: "100%", height: "42px" }}
                                placeholder="Escribe un comentario"
                                description="Descripción del gasto"
                                error={error?.type === "required"}
                                errorHintText={error?.type === "required" ? "Escribe un comentario" : ""}
                            />
                        )}
                    />
                </form>
            </ModalBody>
            <ModalFooter>
                <PrimaryButton
                    text="Aceptar"
                    form="pago-propinas-confirm--reception-form"
                    type="submit"
                    disabled={isLoadingDelayed}
                />
            </ModalFooter>
            <LoaderComponent visible={isLoading} />
        </ModalContent>
    )
}

export default ModalContentReception
