import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import "./PagoPropinasMain.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { InputText } from "src/shared/components/forms"
import SerachLg from "src/shared/icons/SearchLg"
import FlexibleTable, { TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import SimpleResizableCheckbox from "src/shared/components/forms/SimpleResizableCheckbox/SimpleResizableCheckbox"
import CircleMore from "src/shared/icons/CircleMore"
import CircleMinus from "src/shared/icons/CircleMinus"
import CircleEqual from "src/shared/icons/CircleEqual"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import profileDefault from "src/assets/webp/profile_default.webp"
import {
    ColaboradorToPayPropina,
    setColaboradoresToPayPropina,
    //setLastColaboradorMontoAPagarEdited,
} from "src/store/propinas/pagoPropinasSlice"
//import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { useDispatch, useSelector } from "react-redux"
import { useAjustarAsignacionPropinaMutation, useGetPuestosByHotelIdQuery } from "src/gql/schema"
import { RootState } from "src/store/store"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { add } from "src/shared/helpers/calculator"
import ModalAjuste from "../../modals/ajuste"
import { Params } from "../../modals/ajuste/index.type"

const PagoPropinasMain = ({
    colaboradores,
    montoAcumulado,
    onChangeAjuste,
    repartoPropinas = [],
}: {
    colaboradores: ColaboradorToPayPropina[]
    montoAcumulado: number
    onChangeAjuste: (reparto_propinas: any[], monto_recaudado: number, limite_disponible: number) => void
    repartoPropinas: any[]
}) => {
    const [ajustarAsignacionPropina] = useAjustarAsignacionPropinaMutation()
    const [loader, setLoader] = useState<boolean>(false)
    const [colaborador, setColaborador] = useState<any>(null)
    const { totalPagoPropinas, colaboradoresToPayPropinas } = useSelector(
        (state: RootState) => state.propinas.pagoPropinas
    )
    const params = useParams()

    //const [allSelectedButonSelected, setallSelectedButonSelected] = useState(false)

    const [searhColaboradorText, setsearhColaboradorText] = useState("")

    const { data } = useGetPuestosByHotelIdQuery()

    const dispatch = useDispatch()

    const [filtersSelected, setfiltersSelected] = useState<TableFilter[]>([])

    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        //totalPagoPropinas > montoAcumulado
        if (false) {
            showSnackbar({
                title: "Presupuesto excedido",
                text: `El total a pagar **(${formatCurrency(
                    totalPagoPropinas
                )})** excede el presupuesto disponible de propinas **(${formatCurrency(
                    montoAcumulado
                )}).** Revisa los montos a pagar a tu personal.`,
                status: "error",
            })
        }
    }, [totalPagoPropinas, montoAcumulado])

    const rows = searhColaboradorText.length
        ? colaboradores?.filter((c) => c.name.trim().toLowerCase().includes(searhColaboradorText.toLowerCase().trim()))?.filter((c) => (filtersSelected.length ? filtersSelected.some((f) => f.filter === c.rolName) : c))
        : colaboradores?.filter((c) => filtersSelected.length ? filtersSelected.some((f) => f.filter === c.rolName) : c)

    const totals = useMemo(() => {
        let totalVentas = 0
        let totalFondo = 0
        let totalComision = 0
        let totalPago = 0

        rows.forEach((i) => {
            totalVentas += Number(i?.porVentas || 0)
            totalFondo += Number(i?.fondo || 0)
            totalComision += Number(i?.comision || 0)
            totalPago += Number(i?.pago || 0)
        })

        return [
            "Total",
            formatCurrency(totalVentas),
            formatCurrency(totalFondo),
            formatCurrency(totalComision),
            formatCurrency(totalPago),
        ]
    }, [rows])

    const handleChangeAjuste = (ajustarAsignacionPropinaInput: Params) => {
        setLoader(true)
        ajustarAsignacionPropina({
            variables: {
                ajustarAsignacionPropinaInput,
            },
        })
            .then(({ data }) => {
                const res = data?.ajustar_asignacion_propina
                const array = repartoPropinas?.map((item) => {
                    const find = res?.propinas_ajustadas?.find(
                        (i) => i?.asignacion_propina_id === item?.asignacion_propina_id
                    )
                    return find ? find : item
                })
                onChangeAjuste(array, res?.monto_recaudado || 0, res?.limite_disponible || 0)
            })
            .catch(((e)=>{
                showSnackbar({ title: "Error al ajustar propina", status: "error" })
                console.log(e)
            }))
            .finally(() => setLoader(false))
    }

    const selectedItems = colaboradoresToPayPropinas.filter(({ selected }) => selected).length

    return (
        <div className="pago-propinas__main" id="proinas-main-form">
            <Link to={`/u/propinas/detalle-propinas/${params?.date}`} className="pago-propinas__link">
                {"Ver detalle"}
            </Link>
            <div className="pago-propinas__main__header">
                <p className="pago-propinas__main__header__title">{`Monto recaudado: ${formatCurrency(
                    montoAcumulado
                )}`}</p>
                <div className="pago-propinas__main__divider"></div>
            </div>
            <InputText
                type="text"
                placeholder="Busca por nombre de colaborador"
                icon={SerachLg}
                value={searhColaboradorText}
                onChange={(e) => setsearhColaboradorText(e.target.value)}
                iconProps={{ color: "var(--primary)" }}
            />
            <div className="pago-propinas__main__table__wrapper">
                <div className="pago-propinas__main__table">
                    <FlexibleTable
                        onSelectedFilters={(v) => setfiltersSelected(v)}
                        tableItems={{
                            headers: [
                                {
                                    value: "Pagar",
                                    valueToDisplay: (
                                        <div
                                            className="pago-propinas__main__table__header__cell"
                                            style={{ justifyContent: "center", width: 30 }}
                                        >
                                            <SimpleResizableCheckbox
                                                value={selectedItems > 0}
                                                width={25}
                                                height={25}
                                                minusIconOnActive={selectedItems < colaboradoresToPayPropinas.length}
                                                onChange={(value) => {
                                                    dispatch(
                                                        setColaboradoresToPayPropina(
                                                            colaboradores.map((c) => ({
                                                                ...c,
                                                                selected: value,
                                                                montoAPagar: value ? add(c.pago, 0) : 0,
                                                            }))
                                                        )
                                                    )
                                                }}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    value: "Personal",
                                    isFilterUnique: false,
                                    valueToDisplay: (
                                        <div className="pago-propinas__main__table__header__cell">
                                            <span className="pago-propinas__main__table__header__text">Personal</span>
                                        </div>
                                    ),
                                    filterMenu: data?.puestos.map((p) => ({
                                        value: p.nombre,
                                        valueToDisplay: p.nombre,
                                    })),
                                },
                                {
                                    value: "Recaudado",
                                    valueToDisplay: (
                                        <div className="pago-propinas__main__table__header__cell">
                                            <span className="pago-propinas__main__table__header__text pago-propinas__main__table__header__pv">
                                                {"Propina recolectada"}
                                            </span>
                                            <CircleMore />
                                        </div>
                                    ),
                                },
                                {
                                    value: "C. efectivo",
                                    valueToDisplay: (
                                        <div className="pago-propinas__main__table__header__cell">
                                            <span
                                                className="pago-propinas__main__table__header__text"
                                                style={{ whiteSpace: "inherit" }}
                                            >
                                                {"Fondo de propinas"}
                                            </span>
                                            <CircleMinus />
                                        </div>
                                    ),
                                },
                                {
                                    value: "C. bancaria",
                                    valueToDisplay: (
                                        <div className="pago-propinas__main__table__header__cell">
                                            <span className="pago-propinas__main__table__header__text">
                                                C. bancaria
                                            </span>
                                            <CircleEqual height={18} />
                                        </div>
                                    ),
                                },
                                {
                                    value: "A repartir",
                                    valueToDisplay: (
                                        <span className="pago-propinas__main__table__header__text pago-propinas__main__table__header__pc">
                                            {"Pago correspondiente"}
                                        </span>
                                    ),
                                },
                                // {
                                //     value: "Monto a pagar",
                                //     valueToDisplay: (
                                //         <span className="pago-propinas__main__table__header__text">Monto a pagar</span>
                                //     ),
                                // },
                            ],
                            rows: rows?.map((c, index) => ({
                                value: [
                                    {
                                        value: (
                                            <div className="pago-propinas__main__table__body__cell">
                                                <SimpleResizableCheckbox
                                                    width={25}
                                                    height={25}
                                                    onClick={(e) => e.preventDefault()}
                                                    value={c.selected}
                                                    onChange={(e) => {
                                                        dispatch(
                                                            setColaboradoresToPayPropina(
                                                                colaboradores.map((colab) => {
                                                                    if (colab.id === c.id) {
                                                                        return {
                                                                            ...colab,
                                                                            selected: e,
                                                                            montoAPagar: e ? add(c.pago, 0) : 0,
                                                                        }
                                                                    }
                                                                    return colab
                                                                })
                                                            )
                                                        )
                                                    }}
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        value: (
                                            <div className="pago-propinas__main__table__body__cell__personal__wrapper">
                                                <img
                                                    src={c.photoUrl || profileDefault}
                                                    className="pago-propinas__main__table__body__cell__personal__photo"
                                                />
                                                <div className="pago-propinas__main__table__body__cell__personal__content">
                                                    <span className="pago-propinas__main__table__body__cell__personal__content__title">
                                                        {c.name}
                                                    </span>
                                                    <span className="pago-propinas__main__table__body__cell__personal__content__subtitle">
                                                        {c.rolName}
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        value: formatCurrency(c.porVentas),
                                    },
                                    {
                                        value: formatCurrency(c.fondo),
                                    },
                                    {
                                        value: formatCurrency(c.comision),
                                    },
                                    {
                                        value: (
                                            <div className="">
                                                <span>{formatCurrency(c.pago)}</span>
                                                <p
                                                    className="pago-propinas__main__table__body__cell__pago-link"
                                                    onClick={() =>
                                                        setColaborador({
                                                            nombre: c?.name || "",
                                                            puesto: c?.rolName || "",
                                                            monto: c?.asignacion_propina?.fondo_original || 0,
                                                            monto_ajuste: c?.asignacion_propina?.monto_ajuste || 0,
                                                            colaborador_id: c?.id || "",
                                                            puesto_id: c?.puesto_id || "",
                                                            ingreso_hotel: c?.asignacion_propina?.ingreso_hotel || false,
                                                        })
                                                    }
                                                >
                                                    {Number(c?.asignacion_propina?.monto_ajuste || 0) > 0 ? "Editar" : "Ajustar"}
                                                </p>
                                            </div>
                                        ),
                                    },
                                    // {
                                    //     value: (
                                    //         <InputCurrency
                                    //             limitAfterPoint={2}
                                    //             inputWrapperClass="pago-propinas__input-cell"
                                    //             withIcon={false}
                                    //             label=""
                                    //             disabled={!c.selected}
                                    //             placeholder="-"
                                    //             onClick={(e) => e.stopPropagation()}
                                    //             onChange={(v) => {
                                    //                 dispatch(setLastColaboradorMontoAPagarEdited({ ...c, montoAPagar: v }))
                                    //                 dispatch(
                                    //                     setColaboradoresToPayPropina(
                                    //                         colaboradores.map((colab) => {
                                    //                             if (colab.id === c.id) {
                                    //                                 return {
                                    //                                     ...colab,
                                    //                                     montoAPagar: v,
                                    //                                 }
                                    //                             }
                                    //                             return colab
                                    //                         })
                                    //                     )
                                    //                 )
                                    //             }}
                                    //             value={c.montoAPagar}
                                    //             negative={c.montoAPagar < 0}
                                    //             error={
                                    //                 (lastColaboradorMontoAPagarEdited?.id === c.id &&
                                    //                     c.montoAPagar > c.pago) ||
                                    //                 (c.selected && !c.montoAPagar)
                                    //             }
                                    //             errorhinttext={
                                    //                 c.selected && !c.montoAPagar
                                    //                     ? `Ingresa un valor`
                                    //                     : c.montoAPagar > c.pago
                                    //                     ? `Máx: ${c.pago}`
                                    //                     : ""
                                    //             }
                                    //         />
                                    //     ),
                                    // },
                                ],
                            })),
                        }}
                        emptyState={{
                            headerIcon: "userFilled",
                            titile: "No se encontraron resultados",
                        }}
                    />
                </div>
                <div className="pago-propinas__main__table__total">
                    {totals.map((item, index) => (
                        <div
                            className="pago-propinas__main__table__cell-total"
                            style={{ alignItems: index === 0 || index === 5 ? "center" : "flex-start" }}
                            key={index}
                        >
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <LoaderComponent visible={loader} />
            {colaborador && (
                <ModalAjuste
                    colaborador={colaborador}
                    onClose={() => setColaborador(null)}
                    onChange={handleChangeAjuste}
                />
            )}
        </div>
    )
}

export default PagoPropinasMain
