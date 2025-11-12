import { Controller, useForm } from "react-hook-form"
import { Button } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import "./Efectivo.css"
import { useDispatch, useSelector } from "react-redux"
import { setEfectivoIngresado } from "src/store/cortes/cortesSlice"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { RootState } from "src/store/store"

interface FormIngresarEfectivo {
    monto: number | any
}

const Efectivo = ({
    visible,
    setVisible,
}: {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const efectivo = useSelector((root: RootState) => root.cortes.efectivo_ingresado)

    const defaultValues: FormIngresarEfectivo = {
        monto: efectivo ? Number(efectivo) : null,
    }
    const dispatch = useDispatch()
    const { showSnackbar } = useSnackbar()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormIngresarEfectivo>({
        defaultValues,
    })

    const onSubmit = (data: FormIngresarEfectivo) => {
        const monto = Number(data?.monto || 0)
        localStorage.setItem("efectivoIngresado", `${monto}`)
        dispatch(setEfectivoIngresado(monto))
        showSnackbar({
            title: "Efectivo registrado",
            text: `Se registró la cantidad de **${formatCurrency(monto)}** en efectivo.`,
            status: "success",
        })
        setVisible(false)
    }

    return (
        <Modal
            isOpen={visible}
            onClose={() => setVisible(false)}
            width={400}
            withCloseButton
            isCancelableOnClickOutside={false}
            className="efectivo-modal"
        >
            <HeaderIcon title="Registro de efectivo" icon="coinMoney" />
            <h3 className="form-add-fajilla__title">
                <p>Ingresa el monto en efectivo recibido al final del corte</p>
            </h3>
            <form className="form-add-fajilla" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="monto"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <InputCurrency
                            errorhinttext={errors.monto ? "Ingresa un monto" : undefined}
                            error={!!errors.monto}
                            label="Monto"
                            placeholder="0"
                            onChange={(value) => onChange(value)}
                            value={value}
                            icon={"currencyFill"}
                        />
                    )}
                />
                <Button text="Registrar efectivo" type="submit" style={{ width: "100%" }} />
            </form>
        </Modal>
    )
}

export default Efectivo
