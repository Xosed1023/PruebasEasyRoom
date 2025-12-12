import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Ticket, { TicketBlock, TicketContent } from "src/shared/sections/ticket/Ticket"
import { ItemTicket, ProductTicket } from "./sections/Elements"
import { FormValues, NumRefunds, Product } from "./Cancelacion.type"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import Screen from "src/shared/components/layout/screen/Screen"
import Switch from "src/shared/components/forms/switch/Switch"
import { Controller, useForm } from "react-hook-form"
import { defaultValues, reasons } from "./Cancelacion.constants"
import { allProducts } from "./Cancelacion.constants"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { TextBox } from "src/shared/components/forms"
import ModalConfirm from "./sections/ModalConfirm"
import "./Cancelacion.css"
import { usePrintTicket } from "src/shared/hooks/print"
import { getIcon } from "../productos/Products.helpers"
import useGetOrdenes from "./hooks/useGetOrdenes"
import useCancelarOrden from "./hooks/useCancelarOrden"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { DetalleOrden, Orden } from "src/gql/schema"
import { selectOrder } from "src/store/orders/ordersSlice"

function CancelacionesRoomService(): JSX.Element {
    const { orden_comanda_id = "" } = useParams()
    const location = useLocation()
    const mode = location.pathname.split("/").filter(Boolean).pop() as "order" | "comanda"
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { handlePrint } = usePrintTicket()
    const [invalidIndexes, setInvalidIndexes] = useState<number[]>([])

    const [order, setOrder] = useState<{
        orden: Orden | null
        folioComanda: string | null
        total_con_ivaComanda: number | null
    } | null>(null)
    const [products, setProducts] = useState<any>()
    const [refunds, setRefunds] = useState<Product[]>([])
    const [numRefunds, setNumRefunds] = useState<NumRefunds[]>([])
    const [load, setLoad] = useState<boolean>(true)
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false)
    const [getDetalles] = useGetOrdenes({
        mode: mode,
        ordenOComandaID: orden_comanda_id,
    })

    const [cancelarDetalles] = useCancelarOrden({ mode: mode, ordenOComandaID: orden_comanda_id })

    const getOrderData = async () => {
        setLoad(true)
        try {
            const { detallesOrden, orden, folioComanda, total_con_iva } = await getDetalles()
            setOrder({
                orden,
                folioComanda,
                total_con_ivaComanda: total_con_iva,
            })
            setProducts(listProducts(detallesOrden as DetalleOrden[]))
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(() => setLoad(false), 500)
        }
    }

    const listProducts = (productos: Array<any>): Array<any> => {
        let counter = 1

        const list =
            productos?.flatMap((product) => {
                const almacen_articulo = product?.almacen_articulo
                const articulo = almacen_articulo?.articulo
                return {
                    goTo: `${product?.detalle_orden_id}/${getIcon(articulo?.categoria_articulo?.nombre || "")}`,
                    value: [
                        { value: counter++ },
                        { value: articulo?.descripcion || "Sin descripción" },
                        { value: articulo?.categoria_articulo?.nombre || "Sin categoría" },
                        { value: `$${articulo?.precio?.monto}` },
                        { value: "false" },
                        { value: "false" },
                    ],
                }
            }) || []

        const listExtras =
            productos?.flatMap((product) => {
                const extras = product?.extras || []
                return extras.map((extra) => {
                    const almacen_articulo = extra?.almacen_articulo
                    const articulo = almacen_articulo?.articulo
                    return {
                        goTo: `${product?.detalle_orden_id}/${getIcon(articulo?.categoria_articulo?.nombre || "")}`,
                        value: [
                            { value: counter++ },
                            { value: articulo?.descripcion || "Sin descripción" },
                            { value: articulo?.categoria_articulo?.nombre || "Sin categoría" },
                            { value: `$${extra?.costo_con_iva}` },
                            { value: "false" },
                            { value: "false" },
                        ],
                    }
                })
            }) || []

        const concatenatedArray = [...list, ...listExtras]
        return concatenatedArray
    }

    const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
        defaultValues,
    })
    const motivo = watch("reason")

    const toggleDrawerState = (value: boolean) => {
        dispatch(toggleDrawer(value))
        if (!value) dispatch(selectOrder(""))
    }

    //método para cambiar el estado del switch
    const handleChange = (position, row, val, data: any) => {
        const selectedRow = products[row]

        if (position === 4 && val) {
            selectedRow.value[position + 1] = { value: `false` }
        } else if (position === 5 && val) {
            selectedRow.value[position - 1] = { value: `false` }
        }

        selectedRow.value[position] = { value: `${val}` }
        setProducts([...products])
        const hasDevolucion = selectedRow.value[4]?.value === "true"
        const hasMerma = selectedRow.value[5]?.value === "true"

        if (hasDevolucion || hasMerma) {
            setInvalidIndexes((prev) => prev.filter((i) => i !== row))
        }
        buildRefund(products[row], data.goTo)
    }

    // método para mostrar productos que van a ser devueltos
    const buildRefund = (productoRefund: any, infoProduct: string) => {
        const arrRefunds = refunds
        const exist = arrRefunds?.findIndex((product) => product.numero === productoRefund.value[0].value)
        const product = {
            id: infoProduct.split("/")[0],
            numero: productoRefund.value[0].value,
            devolucion: productoRefund.value[4].value,
            merma: productoRefund.value[5].value,
        }
        if (exist === -1) {
            arrRefunds.push(product)
        } else if (product.devolucion === "false" && product.merma === "false") {
            arrRefunds.splice(exist, 1)
        } else {
            arrRefunds[exist].devolucion = product.devolucion
            arrRefunds[exist].merma = product.merma
        }
        setRefunds([...arrRefunds])
    }

    //sumar devoluciones y mermas
    useEffect(() => {
        let devolucion = 0
        let merma = 0

        refunds.forEach((element) => {
            if (element.devolucion === "true") {
                devolucion += 1
            }
            if (element.merma === "true") {
                merma += 1
            }
        })
        setNumRefunds([
            { label: "Devolución a inventario", value: devolucion },
            { label: "Merma", value: merma },
        ])
    }, [refunds])

    const onSubmit = async (values: any) => {
        // Detectar productos sin ninguna opción seleccionada
        const incomplete = products
            ?.map((product, index) => {
                const devolucion = product.value[4]?.value === "true"
                const merma = product.value[5]?.value === "true"
                return !devolucion && !merma ? index : null
            })
            .filter((i) => i !== null) as number[]

        // Mostrar error visual y toast si hay productos incompletos
        if (incomplete.length > 0 || refunds?.length <= 0 || refunds?.length < products?.length) {
            setInvalidIndexes(incomplete)
            showSnackbar({
                text: "Por favor, indica si cada producto será devuelto al inventario o enviado a merma antes de continuar.",
                status: "error",
                title: "Selecciona una opción para cada producto",
            })
            return
        }

        setInvalidIndexes([])

        dispatch(toggleDrawer(false))
        dispatch(selectOrder(""))
        setLoad(true)

        const dataProducts = refunds.map(({ id, merma, devolucion }) => {
            return {
                detalle_orden_id: id ?? "",
                devolucion_a_inventario: devolucion === "true",
                merma: merma === "true",
            }
        })

        const motivo = watch("reason")
        const detalle = watch("detail")
        const motivo_cancelacion = motivo === "Otro" ? detalle : motivo

        cancelarDetalles({
            detalles_orden: dataProducts,
            motivo_cancelacion,
        })
            .then(({ ticket_id }) => {
                if (ticket_id) {
                    handlePrint(ticket_id || "", "original")
                }

                if (mode === "order") {
                    showSnackbar({
                        text: `La comanda **${order?.orden?.orden}** fue cancelada exitosamente`,
                        status: "success",
                        title: "Comanda cancelada",
                    })
                    navigate(-1)
                    return
                }

                showMiniSnackbar({
                    text: `La comanda **${order?.folioComanda}** fue cancelada exitosamente`,
                    status: "success",
                    title: "Comanda cancelada",
                })
                navigate(-1)
            })
            .catch((e) => {
                console.log("error, ", e)
                showSnackbar({
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                    title: "Error al realizar la cancelación",
                })
            })
            .finally(() => {
                setLoad(false)
            })
    }

    const onSuccessModal = () => {
        dispatch(toggleDrawer(false))
        dispatch(selectOrder(""))
        setIsModalConfirmOpen(false)
        if (mode === "order") {
            showSnackbar({
                text: `La órden **${order?.orden}**, con un monto de **${formatCurrency(
                    Number(order?.orden?.total_con_iva)
                )}**, ha sido cancelada. Este monto **no aparecerá** en los **movimientos del corte.**`,
                status: "success",
                title: "Cancelación exitosa",
            })
            //"/u/room-service/ordenes"
            navigate(-1)
            return
        }
        showMiniSnackbar({
            status: "success",
            title: "Comanda cancelada",
            text: `La comanda ${order?.folioComanda} fue cancelada exitosamente`,
        })
        //"/u/restaurante-home"
        navigate(-1)
    }

    useEffect(() => {
        if (orden_comanda_id) {
            getOrderData()
        }
    }, [orden_comanda_id])

    return (
        <Screen
            title={mode === "order" ? "Cancelación de orden" : "Cancelación de comanda"}
            className="cancelacion-productos"
            contentClassName={"cancelacion-productos__content"}
            back={true}
            close={true}
            onClose={() => {
                toggleDrawerState(false)
                dispatch(selectOrder(""))
                navigate("/u")
            }}
        >
            <div className="cancelacion-productos__subtitle">
                Orden:<strong> {order?.orden?.orden || order?.folioComanda}</strong>
            </div>
            <form className="cancelacion-productos__form" onSubmit={handleSubmit(onSubmit)}>
                <section className="cancelacion-productos__left">
                    <div className="cancelacion-productos__section">
                        <div className="cancelacion-productos__section__title">Productos</div>
                        <div className="cancelacion-productos__table">
                            {!load ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: allProducts.headers,
                                            rows: products?.map((row, i) => ({
                                                value: row?.value?.map(({ value }, index) => ({
                                                    value:
                                                        index === 4 || index === 5 ? (
                                                            <Switch
                                                                value={value === "true"}
                                                                onChange={(value) => {
                                                                    handleChange(index, i, value, row)
                                                                }}
                                                            />
                                                        ) : index === 1 ? (
                                                            <span
                                                                className={
                                                                    invalidIndexes.includes(i)
                                                                        ? "cancelacion-productos__invalido"
                                                                        : ""
                                                                }
                                                            >
                                                                {value.toString()}
                                                            </span>
                                                        ) : (
                                                            value
                                                        ),
                                                })),
                                                goTo: row.goTo,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <TableSkeleton headers={allProducts.headers} />
                            )}
                        </div>
                    </div>
                    <div className="cancelacion-productos__section__title">Motivo de cancelación</div>
                    <div className="cancelacion-productos__section_form">
                        <Controller
                            control={control}
                            name={"reason"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Dropdown
                                    className="cancelacion-productos__dropdown"
                                    value={value}
                                    label={"Motivo"}
                                    placeholder="Selecciona una opción"
                                    onClick={({ label, value }) => {
                                        onChange(value)
                                        setValue("reason", value)
                                    }}
                                    options={reasons}
                                    icon={"DocumentExcelFilled"}
                                    iconInOptions={false}
                                    errorHintText={error && "Selecciona una opción"}
                                />
                            )}
                        />
                        {motivo === "Otro" && (
                            <Controller
                                control={control}
                                name={"detail"}
                                rules={{ required: motivo === "Otro" ? true : false, maxLength: 50 }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <TextBox
                                        placeholder="Escribe el motivo"
                                        onChange={(e) => onChange(e.target.value)}
                                        value={value}
                                        error={!!error}
                                        description="Detalle de cancelación"
                                        errorHintText={
                                            error?.type === "maxLength"
                                                ? "Máximo de caracteres: 50"
                                                : "Ingresa un motivo"
                                        }
                                        characterLimit={50}
                                        className="cancelacion-productos__text-box"
                                    />
                                )}
                            />
                        )}
                    </div>
                </section>
                <section>
                    <Ticket
                        title={"Resumen de cancelación"}
                        className="cancelacion-productos__ticket"
                        btnLabel="Procesar cancelación"
                    >
                        <TicketContent clasName="cancelacion-productos__ticket__content">
                            <div className="cancelacion-productos__ticket__products">
                                {products && products.length > 0 ? (
                                    products.map(({ value }, index) => (
                                        <ProductTicket nombre={value[1]?.value} precio={value[3]?.value} key={index} />
                                    ))
                                ) : (
                                    <EmptyState title="" icon="emptyState" subtitle="No hay productos a devolver" />
                                )}
                            </div>
                            <div className="cancelacion-productos__ticket__bottom">
                                <TicketBlock className="cancelacion-productos__ticket__block">
                                    <div className="cancelacion-productos__line"></div>
                                    {numRefunds?.map(({ label = "", value = 0 }, index) => (
                                        <ItemTicket label={label} value={value} key={index} />
                                    ))}
                                </TicketBlock>
                                <TicketBlock className="cancelacion-productos__ticket__block-total">
                                    <div className="cancelacion-productos__ticket__item-row">
                                        <div className="cancelacion-productos__ticket__item-total">
                                            {"Por cancelar"}
                                        </div>
                                        <span className="cancelacion-productos__ticket__item-total">
                                            {formatCurrency(
                                                Number(order?.orden?.total_con_iva || order?.total_con_ivaComanda || 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="cancelacion-productos__line"></div>
                                </TicketBlock>
                            </div>
                        </TicketContent>
                    </Ticket>
                </section>
            </form>
            {numRefunds.length > 0 && (
                <ModalConfirm
                    visible={isModalConfirmOpen}
                    onClose={onSuccessModal}
                    orderItems={[
                        formatCurrency(Number(order?.orden?.total_con_iva || order?.total_con_ivaComanda || 0)),
                        numRefunds[0]?.value || "0",
                        numRefunds[1]?.value || "0",
                    ]}
                />
            )}
        </Screen>
    )
}

export default CancelacionesRoomService
