import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    EstadosArticulo,
    TipoArticulo,
    UnidadMedidasArticulo,
    useActualizarArticuloMutation,
    useGetAlmacenArticuloForEditQuery,
} from "src/gql/schema"
import FormProducto from "../form"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { uploadImage } from "../form/helpers/upload"
import { FormValuesParam } from "../form/Form.types"

function EditarProducto(): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const { loading, data } = useGetAlmacenArticuloForEditQuery({
        variables: { almacen_articulo_id: params?.articulo_id || "" },
    })
    const [actualizarArticulo] = useActualizarArticuloMutation()

    const [load, setLoad] = useState<any>(false)

    const { showSnackbar } = useSnackbar()

    const almacen_articulo = data?.almacen_articulo

    const articulo = almacen_articulo?.articulo

    const onShowError = (key: string) =>
        showSnackbar({
            title: `Error al editar el ${key.toLowerCase()}`,
            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            status: "error",
        })

    const handleSubmit = async (data: FormValuesParam) => {
        const key = data.venta ? "Producto" : "Insumo"

        setLoad(true)

        try {
            const foto: null | string = await uploadImage(data)
            const cantidad_minima = Number(data.alerta_inventario) || 0
            const vars = {
                foto,
                articulo_id:  almacen_articulo?.articulo_id || "",
                cantidad_minima: cantidad_minima > 0 ? cantidad_minima : null,
                categoria_id: data.categoria_id || null,
                contenido: Number(data.contenido),
                costo: data.costo,
                estado: data.activo ? EstadosArticulo.Activado : EstadosArticulo.Desactivado,
                marca: data.marca || null,
                precio: data.precio,
                unidad: data.unidad as UnidadMedidasArticulo,
                almacen_id: data.almacen_id,
                tipo: data.venta ? TipoArticulo.Venta : TipoArticulo.Insumo,
                extra: articulo?.extra || false,
                sku: data.sku,
            }
            const res = await actualizarArticulo({
                variables: {
                    updateArticuloInput: articulo?.nombre !== data.nombre ? { ...vars, nombre: data.nombre } : vars,
                },
            })

            if (res?.data?.actualizar_articulo?.articulo_id) {
                showSnackbar({
                    title: data.precio > 0 ? "Producto actualizado" : "Insumo actualizado",
                    text: `Se han guardado los cambios existosamente.`,
                    status: "success",
                })
                navigate(-1)
            } else {
                onShowError(key)
            }
        } catch (e) {
            onShowError(key)
        } finally {
            setLoad(false)
        }
    }

    return !loading ? (
        articulo ? (
            <>
                <FormProducto
                    type={"edit"}
                    defaultValues={{
                        nombre: articulo?.nombre || "",
                        foto: articulo?.foto || "",
                        venta: articulo?.tipo === TipoArticulo.Venta,
                        marca: articulo?.marca || "",
                        contenido: articulo?.contenido ? `${articulo?.contenido}` : "",
                        categoria_id: articulo?.categoria_id || "",
                        costo: articulo?.costo?.monto || 0,
                        precio: articulo?.precio?.monto || 0,
                        cantidad_inventario: "",
                        alerta_inventario: articulo?.cantidad_minima ? `${articulo?.cantidad_minima}` : "",
                        unidad: articulo?.unidad || "",
                        almacen_id: almacen_articulo?.almacen_id || "",
                        activo: articulo?.estado && articulo?.estado === "activado",
                        sku: articulo?.sku || "",
                    }}
                    onChange={handleSubmit}
                />
                <LoaderComponent visible={load} />
            </>
        ) : (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <p>{"Producto no encontrado"}</p>
            </div>
        )
    ) : (
        <></>
    )
}

export default EditarProducto
