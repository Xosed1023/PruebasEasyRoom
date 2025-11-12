import { useState } from "react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import Costs from "../../components/Costs/Costs"
import Payments from "../../components/Payments/Payments"
import "./Resumen.css"
//import Slider from "../../components/Slider/Slider"
import { TiposAlojamientos, TiposEntradas, TiposPagos } from "src/gql/schema"
import { Button } from "src/shared/components/forms"
import { getDateStringMDY } from "src/utils/date"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import AbonarShowPayments from "src/pages/easyrewards/components/AbonarShowPayments/AbonarShowPayments"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { PAYMENT_METHODS } from "src/constants/payments"
import { useLocation } from "react-router-dom"

interface ResumenProps {
    onSubmit: () => void
    disabled: boolean
    endDate?: string
    startDate?: string
    nombreHuesped: string
    tipoTarifa: TiposAlojamientos
    tipoEntrada: TiposEntradas
    totalPropinas?: number
    tarifa?: string
    placas?: string
    modelo?: string
    marca?: string
    color?: string
    personas: number
    personasExtras: number
    personasExtrasMax: number
    horasExtras: number
    extraHospedajes: number
    totalAdelantosReserva: number
    isMixto: boolean
    roomDays?: number
    pagos: {
        amount: number
        type: TiposPagos
        number?: string
        montoPropina?: number
    }[]
    costs: {
        room: number
        users: number
        hours: number
        tax: number
        total: number
        general: number
        costoEarlyCheckIn: number
        hospedajes: number
    }
    lovePointsAmount: LovePoint | null
    hotelId: string
    experiencias?: {
        experiencia: { nombre: string }
        total: number
    }[]
}

const Resumen = ({
    onSubmit,
    disabled,
    endDate,
    startDate,
    nombreHuesped,
    pagos,
    placas,
    modelo,
    marca,
    color,
    personas,
    isMixto,
    personasExtras,
    personasExtrasMax,
    horasExtras,
    tipoEntrada,
    tarifa,
    tipoTarifa,
    totalAdelantosReserva,
    roomDays,
    costs,
    totalPropinas,
    lovePointsAmount,
    experiencias = [],
    extraHospedajes,
}: ResumenProps) => {
    const location = useLocation()

    const isPaymentValid = pagos.some(
        (pago) =>
            pago.type === TiposPagos.Efectivo ||
            pago.type === TiposPagos.VisaOMastercard ||
            pago.type === TiposPagos.Amex ||
            pago.type === TiposPagos.DepositoOTransferencia
    )
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisAuthModalOpen(false)
                    onSubmit()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente],
        noNeedAuthModalRoles: [],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <div className="venta-habitacion__resumen__wrapper__wrapper">
            <div className="venta-habitacion__resumen__wrapper">
                <span className="venta-habitacion__resumen__title">Resumen</span>
                <div className="venta-habitacion__resumen">
                    <div className="venta-habitacion__resumen__descriptions">
                        <DescriptionDetail
                            darkMode
                            style={{
                                paddingBottom: "12px",
                            }}
                            label="Fecha de estancia"
                            icon="calendarFill"
                            value={`${startDate ? getDateStringMDY(startDate) : ""} - ${
                                endDate ? getDateStringMDY(endDate) : ""
                            }`}
                        />
                        <DescriptionDetail
                            darkMode
                            style={{
                                paddingBottom: "12px",
                            }}
                            label="Nombre del huésped"
                            icon="userFilled"
                            value={nombreHuesped}
                        />
                        <DescriptionDetail
                            darkMode
                            style={{
                                paddingBottom: "12px",
                            }}
                            label="Tipo de tarifa"
                            icon="dollarCircle"
                            value={tarifa || ""}
                        />
                        <DescriptionDetail
                            darkMode
                            style={{
                                paddingBottom: "12px",
                            }}
                            label="Tipo de entrada"
                            icon={tipoEntrada === TiposEntradas.APie ? "walking" : "car"}
                            value={
                                tipoEntrada === TiposEntradas.APie
                                    ? "A pie"
                                    : `${marca ? marca + " /" : ""}
                                ${modelo ? modelo + " /" : ""}
                                ${color ? color + " /" : ""}
                                ${placas}
                                `
                            }
                        />
                        <DescriptionDetail
                            darkMode
                            style={{
                                paddingBottom: "12px",
                            }}
                            label="Personas"
                            icon="userParentSingle"
                            value={String(personas)}
                        />
                        {extraHospedajes > 0 && (
                            <DescriptionDetail
                                darkMode
                                style={{
                                    paddingBottom: "12px",
                                }}
                                label="Hospedaje extra"
                                icon="MoonFill"
                                value={String(extraHospedajes)}
                            />
                        )}
                        {horasExtras > 0 && (
                            <DescriptionDetail
                                darkMode
                                style={{
                                    paddingBottom: "12px",
                                }}
                                label="Horas extra"
                                icon="Clock"
                                value={String(horasExtras)}
                            />
                        )}
                        {personasExtras > 0 && (
                            <DescriptionDetail
                                darkMode
                                style={{
                                    paddingBottom: "12px",
                                }}
                                label="Personas extras"
                                icon="UserParentFill"
                                value={String(personasExtras)}
                            />
                        )}
                    </div>
                    <Payments pagos={pagos} isMixto={isMixto} />
                    {lovePointsAmount?.saldo !== undefined &&
                        lovePointsAmount?.saldo !== null &&
                        isPaymentValid &&
                        lovePointsAmount.id && <AbonarShowPayments pagos={pagos} easyRewardsId={lovePointsAmount.id} />}
                </div>
            </div>
            <div className="venta-habitacion__resumen__footer__wrapper">
                <Costs
                    totalPropinas={totalPropinas}
                    costos={costs}
                    numHorasExtras={horasExtras}
                    numPersonasExtras={personasExtras}
                    roomDays={roomDays}
                    tipoAlojamiento={tipoTarifa}
                    totalAdelantosReserva={totalAdelantosReserva}
                    experiencias={experiencias}
                />
                <div className="venta-habitacion__payments__divider"></div>
                <div className="venta-habitacion__resumen__footer">
                    <Button
                        disabled={disabled}
                        onClick={() => {
                            if (
                                (personasExtrasMax && personasExtras > personasExtrasMax) ||
                                (!location?.state?.reservaSeleccionada &&
                                    pagos.some((p) => p.type === PAYMENT_METHODS.depositoOTransferencia.value))
                            ) {
                                setisAuthModalOpen(true)
                                return
                            } else {
                                onSubmit()
                            }
                        }}
                        type="button"
                        style={{ width: "calc(100% - 48px)" }}
                        text="Vender habitación"
                    />
                    {Modal}
                </div>
            </div>
        </div>
    )
}

export default Resumen
