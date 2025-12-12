import cx from "classnames"
import { useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDetalle_Reparto_PropinasQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import Screen from "src/shared/components/layout/screen/Screen"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import ModalDesglose from "./modals/Desglose"
import ModalPropinaRecolectada from "./modals/PropinaRecolectada"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import InfoCircle from "src/shared/icons/InfoCircle"
import Icon from "src/shared/icons"
import { HeaderRight } from "./sections/HeaderRight"
import { getCurrencyFormat } from "src/utils/string"
import { getName } from "../../home/helpers/name"
import { headers } from "./constants/headers"
import { RoleNames } from "src/shared/hooks/useAuth"
import "./DetallePagoPropinas.css"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function DetallePagoPropina(): JSX.Element {
    const { hotel_id, rolName } = useProfile()
    const params = useParams()
    const navigate = useNavigate()
    const { formatCustomDate } = useFormatDate()
    const [modal, setModal] = useState<{
        type: "desglose" | "recolectada"
        array: any[]
        name: string
    } | null>(null)

    const { data, loading } = useDetalle_Reparto_PropinasQuery({
        variables: {
            hotel_id,
        },
    })

    const isAdmin = rolName === RoleNames.admin || rolName === RoleNames.superadmin

    const totals = useMemo(() => {
        const total = data?.detalle_reparto_propinas?.totales
        return [
            "Totales",
            getCurrencyFormat(total?.total_propinas_recolectadas || 0),
            getCurrencyFormat(total?.total_aportaciones_a_fondo || 0),
            getCurrencyFormat(total?.total_subtotales_propina_por_ventas || 0),
            getCurrencyFormat(total?.total_comisiones_bancarias_propinas_por_ventas || 0),
            getCurrencyFormat(total?.total_neto_propinas_por_ventas || 0),
            getCurrencyFormat(total?.total_fondos_de_propina || 0),
            getCurrencyFormat(total?.total_comisiones_bancarias_sobre_fondo || 0),
            getCurrencyFormat(total?.total_pagos_correspondientes || 0),
        ]
    }, [data?.detalle_reparto_propinas?.totales])

    return (
        <Screen
            title={`Detalle de pago de propinas - ${params?.date
                ?.split("&")
                ?.map((cur) => formatCustomDate(cur.substring(0, 10), "MMM, DD YYYY"))
                .join(" ")}`}
            className="detale-p-propinas"
            contentClassName="detale-p-propinas__content"
            back
            close
            headerRight={<HeaderRight />}
            onClose={() => navigate("/u")}
        >
            <div className="detale-p-propinas__info">
                <p className="detale-p-propinas__monto">{`Monto recaudado: ${getCurrencyFormat(
                    data?.detalle_reparto_propinas?.monto_recaudado || 0
                )}`}</p>
                <Tooltip
                    style={{ width: "fit-content" }}
                    title="Monto acumulado"
                    theme="dark"
                    description="Monto disponible de propinas para pagar a los colaboradores según lo recaudado de porcentajes de comisión  configurados."
                    placement="bottom"
                >
                    <InfoCircle color="var(--primary)" />
                </Tooltip>
            </div>
            <div className="detale-p-propinas__table">
                <div className="detale-p-propinas__table-content">
                    <FlexibleTable
                        tableItems={{
                            headers: headers.map(({ label = "", icon = "", className = "" }) => {
                                return {
                                    value: "",
                                    valueToDisplay: (
                                        <div className={cx(icon ? "detale-p-propinas__th-grid" : "", className)}>
                                            <span className={cx("detale-p-propinas__th-label")}>{label}</span>
                                            {icon && (
                                                <Icon
                                                    name={icon}
                                                    height={icon === "circleMinus" ? 14 : 18}
                                                    width={14}
                                                />
                                            )}
                                        </div>
                                    ),
                                }
                            }),
                            rows:
                                data?.detalle_reparto_propinas?.detalle_reparto_propinas?.map((i) => {
                                    return {
                                        value: [
                                            {
                                                value: (
                                                    <div className="detale-p-propinas__cell__name">
                                                        <span className="detale-p-propinas__cell__name-label">
                                                            {getName(i.colaborador)}
                                                        </span>
                                                        <span className="detale-p-propinas__cell__name-value">
                                                            {i?.colaborador?.puesto?.nombre || "-"}
                                                        </span>
                                                    </div>
                                                ),
                                            },
                                            {
                                                value: i?.propina_recolectada ? (
                                                    isAdmin && i?.desglose_propina_recolectada?.length > 0 ? (
                                                        <span
                                                            className="detale-p-propinas__link"
                                                            onClick={() =>
                                                                setModal({
                                                                    type: "recolectada",
                                                                    name: getName(i?.colaborador),
                                                                    array: i?.desglose_propina_recolectada || [],
                                                                })
                                                            }
                                                        >
                                                            {getCurrencyFormat(i?.propina_recolectada)}
                                                        </span>
                                                    ) : (
                                                        getCurrencyFormat(i?.propina_recolectada)
                                                    )
                                                ) : (
                                                    "-"
                                                ),
                                            },
                                            {
                                                value: i?.aportacion_a_fondo ? (
                                                    isAdmin && i?.desglose_aportacion_a_fondo?.length > 0 ? (
                                                        <span
                                                            className="detale-p-propinas__link"
                                                            onClick={() =>
                                                                setModal({
                                                                    type: "desglose",
                                                                    name: getName(i?.colaborador),
                                                                    array: i?.desglose_aportacion_a_fondo || [],
                                                                })
                                                            }
                                                        >
                                                            {getCurrencyFormat(i?.aportacion_a_fondo)}
                                                        </span>
                                                    ) : (
                                                        getCurrencyFormat(i?.aportacion_a_fondo)
                                                    )
                                                ) : (
                                                    "-"
                                                ),
                                            },
                                            {
                                                value: i?.subtotal_propina_por_ventas
                                                    ? getCurrencyFormat(i?.subtotal_propina_por_ventas)
                                                    : "-",
                                            },
                                            {
                                                value: i?.comision_bancaria_propina_por_venta
                                                    ? getCurrencyFormat(i?.comision_bancaria_propina_por_venta)
                                                    : "-",
                                            },
                                            {
                                                value: i?.neto_propina_por_ventas
                                                    ? getCurrencyFormat(i?.neto_propina_por_ventas)
                                                    : "-",
                                            },
                                            {
                                                value: i?.fondo_de_propina
                                                    ? getCurrencyFormat(i?.fondo_de_propina)
                                                    : "-",
                                            },
                                            {
                                                value: i?.comision_bancaria_sobre_fondo
                                                    ? getCurrencyFormat(i?.comision_bancaria_sobre_fondo)
                                                    : "-",
                                            },
                                            {
                                                value: i?.pago_correspondiente
                                                    ? getCurrencyFormat(i?.pago_correspondiente)
                                                    : "-",
                                            },
                                        ],
                                    }
                                }) || [],
                        }}
                        emptyState={{
                            titile: "Sin resultados",
                            subTitle: "No hay resultados. Intenta de nuevo.",
                            headerIcon: "HandCoinFilled",
                        }}
                    />
                </div>
                <div className="detale-p-propinas__table-total">
                    {totals.map((item, index) => (
                        <div key={index} className={cx("detale-p-propinas__total-cell")}>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <LoaderComponent visible={loading} />
            {modal && modal?.type === "desglose" ? (
                <ModalDesglose name={modal?.name || ""} value={modal.array || []} onClose={() => setModal(null)} />
            ) : null}
            {modal && modal?.type === "recolectada" ? (
                <ModalPropinaRecolectada
                    name={modal?.name || ""}
                    value={modal.array || []}
                    onClose={() => setModal(null)}
                />
            ) : null}
        </Screen>
    )
}

export default DetallePagoPropina
