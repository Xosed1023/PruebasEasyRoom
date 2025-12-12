import React, { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { isVisibleCardNumber } from "../ModalPagoMixto/helpers";
import { InputText } from "src/shared/components/forms";
import Icon from "src/shared/icons";
import "./CardNumberField.css";
import { PAYMENT_TYPES } from "src/constants/payments";
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput";
import { useModulos } from "src/shared/hooks/useModulos";


const getControllerConfig = (method: string, deposito: boolean) => ({
    rules: {
        minLength: 4,
        maxLength: 10,
    },
    input: {
        label: deposito ? "Número de clabe o referencia" : "Número de tarjeta o referencia",
        icon: Icon,
        placeholder: deposito ? "Ingresa número" : "Máximo 10 dígitos",
    },
});

export const CardNumberField = ({ setLovePointsAmount }) => {
    const { control, setValue } = useFormContext();
    const method = useWatch({
        control,
        name: "method",
    });
    const { easyRewards: withEasyrewards } = useModulos();
    const deposito = method === PAYMENT_TYPES.DepositoOTransferencia
    const controllerConfig = getControllerConfig(method, deposito);

    useEffect(() => {
        if (method === PAYMENT_TYPES.LovePoints) {
            setValue(`extra.${0}.number`, "");
        }
    }, [method, setValue]);

    if (!method || !isVisibleCardNumber(method)) return null;

    if (method === PAYMENT_TYPES.LovePoints && !withEasyrewards) {
        return null;
    }

    if (method === PAYMENT_TYPES.LovePoints && withEasyrewards) {
        return <LovePointsInput setLovePointsAmount={setLovePointsAmount} />;
    }
    return (
        <Controller
            control={control}
            name={`extra.${0}.number`}
            rules={{
                required: true,
                minLength: controllerConfig.rules.minLength,
                maxLength: controllerConfig.rules.maxLength,
            }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
                <InputText
                    icon={controllerConfig.input.icon}
                    iconProps={{
                        color: "var(--header-dark)",
                        height: 16,
                        width: 16,
                        name: "iconHash",
                    }}
                    inputWrapperClass="payment-method__card-number"
                    label={controllerConfig.input.label}
                    type="number"
                    placeholder={controllerConfig.input.placeholder}
                    value={value}
                    onChange={(e) => {
                        const maxLength = controllerConfig.rules.maxLength;
                        const newValue = e.target.value.slice(0, maxLength);
                        onChange(newValue);
                    }}
                    error={errors?.extra?.[0]?.number}
                    errorhinttext={
                        errors?.extra?.[0]?.number ? "Ingresa mínimo 4 dígitos" : ""
                    }
                />
            )}
        />
    );
};
