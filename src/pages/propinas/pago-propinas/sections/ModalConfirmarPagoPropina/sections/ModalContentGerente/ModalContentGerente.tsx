import React, { useEffect } from "react"

import "./ModalContentGerente.css"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { TextBox } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"
import Switch from "src/shared/components/forms/switch/Switch"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputDate from "src/shared/components/forms/input-date/InputDate"
import { TiposPagos, usePagar_PropinasMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useNavigate } from "react-router-dom"
import {
    ColaboradorToPayPropina,
    setMontoAcumulado,
    setTotalPagoPropinas,
    toggleIsModalConfirmarPagoPropinaOpen,
} from "src/store/propinas/pagoPropinasSlice"
import { useProfile } from "src/shared/hooks/useProfile"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { useDispatch } from "react-redux"
import { useDate } from "src/shared/hooks/useDate"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { add } from "src/shared/helpers/calculator"

const defaultValues = {
    isGastoCajaChica: false,
    metodo_pago: "",
    dates: [new Date(), new Date()],
    comentario: "",
}

const ModalContentGerente = ({
    totalPagoPropinas,
    colaboradoresToPayPropinas,
    fechasPagoPropinas,
    montoAcumulado,
    limiteDisponible,
}: {
    totalPagoPropinas: number
    colaboradoresToPayPropinas: ColaboradorToPayPropina[]
    fechasPagoPropinas: Date[]
    montoAcumulado: number
    limiteDisponible: number
}) => {
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            ...defaultValues,
            dates: fechasPagoPropinas,
        },
    })

    const [pagarPropinas] = usePagar_PropinasMutation()
    const { usuario_id, hotel_id } = useProfile()
    const navigate = useNavigate()
    const { areSameDay } = useDate()
    const { showSnackbar } = useSnackbar()
    const dispatch = useDispatch()

    const isGastoCajaChica = watch("isGastoCajaChica")

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    useEffect(() => {
        if (isGastoCajaChica) {
            setValue("metodo_pago", TiposPagos.Efectivo)
        }
    }, [isGastoCajaChica])

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
                    caja_chica: data.isGastoCajaChica,
                    descripcion: data.comentario,
                    detalles_pago: {
                        subtotal,
                        tipo_pago: data.metodo_pago,
                    },
                    limite_disponible: limiteDisponible,
                    pagos_propinas: colaboradoresToPayPropinas.map((pp) => ({
                        colaborador_id: pp.id,
                        comision_bancaria_propina_por_venta: pp.comisionPorVentas,
                        comision_bancaria_sobre_fondo: pp.fondo,
                        monto_pagado: pp.montoAPagar,
                        asignacion_propina_id: pp.asignacion_propina_id,
                    })),
                    periodo_pago: `${formatLongDate(new Date(), false)} ${formatLongDate(new Date(), false)}`,
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
        <ModalContent>
            <ModalRow>
                <IconBorder primaryBgColor="var(--fondo--close)" primaryBgDiameter={60}>
                    <Icon name="handCoin" width={25} height={25} color="var(--primary)" />
                </IconBorder>
                <p className="pago-propinas-confirm--gerente-pago--gerente__title">Pagar propina</p>
                <p className="pago-propinas-confirm--gerente-pago--gerente__title__amount">
                    {formatCurrency(totalPagoPropinas)}
                </p>
            </ModalRow>
            <ModalBody>
                <form
                    className="pago-propinas-confirm--gerente__form"
                    style={{ width: "100%" }}
                    id="pago-propinas-confirm--gerente-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="pago-propinas-confirm--gerente-pago--gasto__wrapper">
                        <div className="pago-propinas-confirm--gerente-pago--gasto">
                            <span className="pago-propinas-confirm--gerente-pago--gasto__text">
                                Gasto de caja chica
                            </span>
                            <Controller
                                control={control}
                                name="isGastoCajaChica"
                                render={({ field: { onChange, value } }) => (
                                    <Switch value={value} onChange={onChange} />
                                )}
                            />
                        </div>
                        <span className="pago-propinas-confirm--gerente-pago--gasto__description">
                            Serán considerados para el cálculo del corte del día.
                        </span>
                    </div>
                    <div className="pago-propinas-confirm--gerente__form__row">
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="metodo_pago"
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Dropdown
                                    label="Método de pago"
                                    onClick={(v) => onChange(v.value)}
                                    value={value}
                                    placeholder="Selecciona una opción"
                                    options={[
                                        { label: "Efectivo", value: TiposPagos.Efectivo },
                                        { label: "Depósito/Transfer", value: TiposPagos.DepositoOTransferencia },
                                    ]}
                                    errorHintText={error?.type === "required" ? "Selecciona un método de pago" : ""}
                                />
                            )}
                        />
                        <Controller
                            rules={{ required: true }}
                            control={control}
                            name="dates"
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputDate
                                    disabledAfterOrEqualDate={new Date()}
                                    label="Periodo del pago de propinas"
                                    onChange={(date) => {
                                        if (value.length === 0) {
                                            onChange([date])
                                            return
                                        }
                                        if (date <= value[0]) {
                                            onChange([date])
                                            return
                                        }
                                        if (value?.length === 2 && areSameDay(new Date(), date)) {
                                            onChange([date])
                                            return
                                        }
                                        if (value?.length === 2) {
                                            onChange([])
                                            return
                                        }
                                        onChange([value[0], date])
                                    }}
                                    onReset={() => onChange(fechasPagoPropinas)}
                                    value={value}
                                />
                            )}
                        />
                    </div>
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
                    form="pago-propinas-confirm--gerente-form"
                    type="submit"
                    disabled={isLoadingDelayed}
                />
            </ModalFooter>
            <LoaderComponent visible={isLoading} />
        </ModalContent>
    )
}

export default ModalContentGerente
