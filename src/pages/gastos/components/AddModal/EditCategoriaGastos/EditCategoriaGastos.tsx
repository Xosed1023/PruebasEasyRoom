import { useDeleteSubCategoriaMutation } from "src/gql/schema"
import { client } from "src/graphql"
import { ACTUALIZAR_CATEGORIA } from "src/pages/gastos/Gastos-Graphql/mutations/actualizar-categoria"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { Button } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
export interface EditCategoriaGastosProps {
    id: string
    title: string
    onClose: () => void
    resEdit: {
        limite: string | undefined
        gasto: string | undefined
    }
    dataAnterior: {
        gasto: string
        limiteA: string
    }
    array: string[]
    subCategorias: any[]
    onSub: (value) => void
}
interface MesajeInfoProps {
    array: string[]
    subCategorias: any[]
    resEdit: {
        limite: string | undefined
        gasto: string | undefined
    }
    dataAnterior: {
        gasto: string
        limiteA: string
    }
}
const EditCategoriaGastos = ({
    onClose,
    resEdit,
    title,
    dataAnterior,
    array,
    onSub,
    id,
    subCategorias,
}: EditCategoriaGastosProps) => {
    const [deleteSubCategoriaMutation] = useDeleteSubCategoriaMutation()

    const sendCambios = async () => {
        let promises: Promise<boolean>[] = []
        if (array.length !== 0) {
            promises = array.map((value) => {
                return deleteSubCategoriaMutation({
                    variables: {
                        id: {
                            subcategoria_gasto_id: value,
                        },
                    },
                })
                    .then((data) => {
                        console.log("success array, ", data)
                        return true
                    })
                    .catch((err) => {
                        console.log("errorsito array, ", err)
                        return false
                    })
            })
        }

        if (resEdit) {
            if (resEdit.gasto || resEdit.limite) {
                const UpdateCategoriaGastosInput = {
                    categoria_id: id,
                    categoria: resEdit.gasto,
                    limite_mensual: resEdit.limite ? parseFloat(resEdit.limite) : resEdit.limite,
                }
                try {
                    const { data } = await client.mutate({
                        mutation: ACTUALIZAR_CATEGORIA,
                        variables: { UpdateCategoriaGastosInput },
                    })
                    if (data) {
                        console.log("success edit, ", data)
                        onSub({
                            texto: `La categoría ${title} ha sido actualizada exitosamente.`,
                            success: true,
                        })
                    }
                } catch (err) {
                    console.log("errorsito edit, ", err)
                    onSub({
                        texto: " ¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        success: false,
                    })
                }
            }
        }

        console.log("promises, ", promises)
        Promise.all(promises).then(function (results) {
            if (results.includes(false)) {
                onSub({
                    texto: " ¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    success: false,
                })
            } else {
                onSub({
                    texto: `La categoría ${title} ha sido actualizada exitosamente.`,
                    success: true,
                })
            }
        })

        onClose()
    }

    return (
        <Modal
            isOpen={true}
            withCloseButton
            onClose={() => onClose()}
            className="edit-categoria-modal"
            width={701}
            isCancelableOnClickOutside={false}
        >
            <HeaderIcon icon="editFill" title="¿Deseas guardar los cambios?" />
            <MesajeEdit resEdit={resEdit} dataAnterior={dataAnterior} array={array} subCategorias={subCategorias} />
            <Button text="Guardar Cambios" onClick={() => sendCambios()} style={{ width: "100%" }} />
        </Modal>
    )
}

const MesajeEdit = ({ resEdit, dataAnterior, array, subCategorias }: MesajeInfoProps) => {
    let subEdited: any[] = []

    if (array.length === 1) {
        subEdited = subCategorias.filter((subcategoria) => subcategoria.subcategoria_gasto_id === array[0])
    }

    console.log("array, ", array)
    console.log("resEdit?.gasto, ", resEdit?.gasto)
    console.log("resEdit?.limite, ", resEdit?.limite)

    return (
        <>
            {resEdit?.gasto && resEdit?.gasto !== "" && resEdit.limite && resEdit.limite !== "" && array.length > 0 && (
                <div className="mesajesEdit">
                    <div className="mesajesEdit__text">
                        <span>{`El nombre de la categoría `}</span>{" "}
                        <span className="mesajesEdit__text-bold">{`"${dataAnterior.gasto}" `} </span>{" "}
                        <span>se editará a </span>
                        <span className="mesajesEdit__text-bold">{`"${resEdit.gasto}"`}</span>
                        {"."}
                    </div>
                    <div className="mesajesEdit__text">
                        <span>{`Se editará  el límite mensual de gastos de `}</span>{" "}
                        <span className="mesajesEdit__text-bold">
                            {`${formatCurrency(Number(dataAnterior.limiteA))} `} a{" "}
                            {`${formatCurrency(Number(resEdit.limite))}`}
                        </span>
                        {"."}
                    </div>
                    {array.length === 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`Se eliminará la subcategoría `}</span>{" "}
                            <span className="mesajesEdit__text-bold">
                                {`"`}
                                {`${subEdited[0].subcategoria} `}
                                {`".`}
                            </span>
                        </div>
                    )}
                    {array.length > 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`Se eliminarán `}</span>
                            <span className="mesajesEdit__text-bold">{`  ${array.length} `} </span>{" "}
                            <span>{` subcategorías.`}</span>
                        </div>
                    )}
                </div>
            )}
            {resEdit?.gasto && resEdit?.gasto !== "" && resEdit.limite === undefined && array.length === 0 && (
                <div className="mesajesEdit">
                    <div className="mesajesEdit__text">
                        <span>{`El nombre de la categoría `}</span>{" "}
                        <span className="mesajesEdit__text-bold">{`"${dataAnterior.gasto}" `} </span>{" "}
                        <span>se editará a </span>
                        <span className="mesajesEdit__text-bold">{`"${resEdit.gasto}"`}</span>
                        {"."}
                    </div>
                </div>
            )}
            {resEdit.limite && resEdit.limite !== "" && resEdit.gasto === undefined && array.length === 0 && (
                <div className="mesajesEdit">
                    <div className="mesajesEdit__text">
                        <span>{`Se editará  el límite mensual de gastos de `}</span>{" "}
                        <span className="mesajesEdit__text-bold">
                            {`${formatCurrency(Number(dataAnterior.limiteA))} `} a{" "}
                            {`${formatCurrency(Number(resEdit.limite))}`}
                        </span>
                        {"."}
                    </div>
                </div>
            )}
            {array.length > 0 && resEdit.limite === undefined && resEdit.gasto === undefined && (
                <div className="mesajesEdit">
                    {array.length === 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`Se eliminará la subcategoría `}</span>{" "}
                            <span className="mesajesEdit__text-bold">
                                {`"`}
                                {`${subEdited[0].subcategoria} `}
                                {`".`}
                            </span>
                        </div>
                    )}
                    {array.length > 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`Se eliminarán `}</span>
                            <span className="mesajesEdit__text-bold">{`  ${array.length} `} </span>{" "}
                            <span>{` subcategorías.`}</span>
                        </div>
                    )}
                </div>
            )}
            {resEdit.limite &&
                resEdit.limite !== "" &&
                resEdit?.gasto &&
                resEdit?.gasto !== "" &&
                array.length === 0 && (
                <div className="mesajesEdit">
                    <div className="mesajesEdit__text">
                        <span>{`El nombre de la categoría `}</span>{" "}
                        <span className="mesajesEdit__text-bold">{`"${dataAnterior.gasto}" `} </span>{" "}
                        <span>se editará a </span>
                        <span className="mesajesEdit__text-bold">{`"${resEdit.gasto}"`}</span>
                        {" y "}
                        <span>{`se editará  el límite mensual de gastos de `}</span>{" "}
                        <span className="mesajesEdit__text-bold">
                            {`${formatCurrency(Number(dataAnterior.limiteA))} `} a{" "}
                            {`${formatCurrency(Number(resEdit.limite))}`}
                        </span>
                        {"."}
                    </div>
                </div>
            )}
            {array.length > 0 && resEdit?.gasto && resEdit?.gasto !== "" && resEdit.limite === undefined && (
                <div className="mesajesEdit">
                    {array.length === 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`El nombre de la categoría `}</span>{" "}
                            <span className="mesajesEdit__text-bold">{`"${dataAnterior.gasto}" `} </span>{" "}
                            <span>se editará a </span>
                            <span className="mesajesEdit__text-bold">{`"${resEdit.gasto}"`}</span>
                            {" y "}
                            <span>{`se eliminará la subcategoría `}</span>{" "}
                            <span className="mesajesEdit__text-bold">
                                {`"`}
                                {`${subEdited[0].subcategoria} `}
                                {`".`}
                            </span>
                        </div>
                    )}
                    {array.length > 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`El nombre de la categoría `}</span>{" "}
                            <span className="mesajesEdit__text-bold">{`"${dataAnterior.gasto}" `} </span>{" "}
                            <span>se editará a </span>
                            <span className="mesajesEdit__text-bold">{`"${resEdit.gasto}"`}</span>
                            {" y "}
                            <span>{`se eliminarán `}</span>
                            <span className="mesajesEdit__text-bold">{`  ${array.length} `} </span>{" "}
                            <span>{` subcategorías.`}</span>
                        </div>
                    )}
                </div>
            )}
            {array.length > 0 && resEdit?.limite && resEdit?.limite !== "" && resEdit.gasto === undefined && (
                <div className="mesajesEdit">
                    {array.length === 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`Se editará  el límite mensual de gastos de `}</span>{" "}
                            <span className="mesajesEdit__text-bold">
                                {`${formatCurrency(Number(dataAnterior.limiteA))} `} a{" "}
                                {`${formatCurrency(Number(resEdit.limite))}`}
                            </span>
                            {" y "}
                            <span>{`se eliminará la subcategoría `}</span>{" "}
                            <span className="mesajesEdit__text-bold">
                                {`"`}
                                {`${subEdited[0].subcategoria} `}
                                {`".`}
                            </span>
                        </div>
                    )}
                    {array.length > 1 && (
                        <div className="mesajesEdit__text">
                            <span>{`Se editará  el límite mensual de gastos de `}</span>{" "}
                            <span className="mesajesEdit__text-bold">
                                {`${formatCurrency(Number(dataAnterior.limiteA))} `} a{" "}
                                {`${formatCurrency(Number(resEdit.limite))}`}
                            </span>
                            {" y "}
                            <span>{`se eliminarán `}</span>
                            <span className="mesajesEdit__text-bold">{`  ${array.length} `} </span>{" "}
                            <span>{` subcategorías.`}</span>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
export default EditCategoriaGastos
