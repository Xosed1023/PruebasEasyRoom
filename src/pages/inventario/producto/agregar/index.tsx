import { useState } from "react"
import { EstadosArticulo, TipoArticulo, UnidadMedidasArticulo, useCrearArticuloMutation } from "src/gql/schema"
import FormProducto from "../form"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { uploadImage } from "./../form/helpers/upload"
import { FormValuesParam } from "../form/Form.types"
import { useNavigate } from "react-router-dom"

function AgregarProducto(): JSX.Element {
    const navigate = useNavigate()

    const [load, setLoad] = useState<any>(false)

    const [crearArticulo] = useCrearArticuloMutation()

    const { showSnackbar } = useSnackbar()

    const { hotel_id, usuario_id } = useProfile()

    const onShowError = (key: string, e?: any) =>
        showSnackbar({
            title: `Error al registrar el ${key.toLowerCase()}`,
            text: e?.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            status: "error",
        })

    const handleSubmit = async (data: FormValuesParam) => {
        const key = data.venta ? "Producto" : "Insumo"
        const cantidad = Number(data.cantidad_inventario) || 0

        setLoad(true)

        try {
            const foto: null | string = await uploadImage(data)
            const res = await crearArticulo({
                variables: {
                    createArticuloInput: {
                        foto,
                        promocion_id: null,
                        cantidad,
                        cantidad_minima: Number(data.alerta_inventario) || 0,
                        categoria_id: data.categoria_id || null,
                        contenido: Number(data.contenido),
                        costo: data.costo,
                        estado: EstadosArticulo.Activado,
                        folio: null,
                        hotel_id,
                        marca: data.marca,
                        nombre: data.nombre,
                        precio: data.precio,
                        unidad: data.unidad as UnidadMedidasArticulo,
                        usuario_id,
                        almacen_id: data.almacen_id,
                        tipo: data.venta ? TipoArticulo.Venta : TipoArticulo.Insumo,
                        extra: false,
                        sku: data.sku || null,
                    },
                },
            })
            if (res?.data?.crear_articulo?.articulo_id) {
                showSnackbar({
                    title: data.precio > 0 ? "Producto registrado" : "Insumo registrado",
                    text: `Se agregó **${data.nombre}**${
                        data.categoria ? ` a **${data.categoria}**` : ""
                    } existosamente.`,
                    status: "success",
                })
                navigate(-1)
            } else {
                onShowError(key)
            }
        } catch (e) {
            console.log(e)
            onShowError(key, e)
        } finally {
            setLoad(false)
        }
    }

    return (
        <>
            <FormProducto
                type={"add"}
                defaultValues={{
                    nombre: "",
                    foto: "",
                    venta: false,
                    marca: "",
                    contenido: "",
                    categoria_id: "",
                    costo: 0,
                    precio: 0,
                    cantidad_inventario: "",
                    alerta_inventario: "",
                    unidad: "",
                    sku: "",
                    activo: true,
                    almacen_id: "",
                }}
                onChange={handleSubmit}
            />

            <LoaderComponent visible={load} />
        </>
    )
}

export default AgregarProducto
