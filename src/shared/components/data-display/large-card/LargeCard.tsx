import cx from "classnames"
import { LargeCardProps } from "./LargeCard.types"
import "./LargeCard.css"
import Icon from "src/shared/icons"
import { useState } from "react"
import { InputText } from "../../forms"
import coinMoney from "src/shared/icons/coin-money"
import {
    DeletCategoriaModal,
    ModalDeleteCat,
} from "src/pages/gastos/components/DeletCategoriaModal/DeletCategoriaModal"
import AddSubCat from "src/pages/gastos/components/AddModal/AddSubCat/AddSubCat"
import EditCategoriaGastos from "src/pages/gastos/components/AddModal/EditCategoriaGastos/EditCategoriaGastos"

function LargeCard({
    className = "",
    containerClassName = "",
    title = "",
    subtitle = "",
    gastos,
    limiteMensual = "",
    presupuesto = "",
    onSubDelete,
    onSubAdd,
    onEditMesaje,
    subCategorias,
    id,
    predeterminado,
}: LargeCardProps): JSX.Element {
    const [status, setStatus] = useState<boolean>(false)
    const [newLimite, setNewLimite] = useState<string>(limiteMensual)
    const [newTitle, setNewTitle] = useState<string>(title)
    const [arraySub, setSubArray] = useState<string[]>([])
    const [isExpanded, setIsExpanded] = useState(false)
    const [deleteMod, setDeleteMode] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [addSub, setAddSub] = useState(false)
    const [addEdith, setAddEdit] = useState(false)
    const [newData, setNewData] = useState<{
        limite: string | undefined
        gasto: string | undefined
    }>({
        limite: "",
        gasto: "",
    })
    const dataAnterior = {
        gasto: title,
        limiteA: limiteMensual,
    }
    const [array, setArray] = useState<Array<string>>([])

    const toggleSelected = (subcategoria: string) => {
        let newArray = array
        if (array.length > 0 && array.includes(subcategoria)) {
            newArray = array.filter((item) => item !== subcategoria)
        } else {
            newArray.push(subcategoria)
        }
        setArray(newArray)
    }
    const onEdit = () => {
        const gasto = title !== newTitle ? newTitle : undefined
        const limite = limiteMensual !== newLimite ? newLimite : undefined

        if (gasto || limite || array.length > 0) {
            setNewData({
                gasto: gasto,
                limite: limite,
            })
            setSubArray(array)
            setAddEdit(true)
        } else {
            setStatus(false)
        }
    }

    const reload = () => {
        setAddEdit(false)
        setStatus(false)
        setArray([])
        setUpdateArray(updateSubArray())
        setDeleteMode(false)
        if (newData.gasto || newData.limite) window.location.reload()
    }

    const setEndUpdate = () => {
        setIsExpanded(false)
        setAddEdit(false)
        setStatus(false)
        setArray([])
        setUpdateArray(updateSubArray())
        setDeleteMode(false)
        setNewData({
            limite: "",
            gasto: "",
        })
        setNewTitle(title)
        setNewLimite(limiteMensual)
    }

    const timeEnd = (value) => {
        value.success ? reload() : setEndUpdate()
        onEditMesaje(value)
    }

    const subFiltered = subCategorias.filter((sub) => sub.eliminado === false)

    const SendDataEdith = () => {
        return (
            <>
                <EditCategoriaGastos
                    title={title}
                    subCategorias={subFiltered}
                    onSub={(value) => {
                        setTimeout(() => timeEnd(value), 2000)
                    }}
                    onClose={() => setEndUpdate()}
                    id={id}
                    dataAnterior={dataAnterior}
                    resEdit={newData}
                    array={arraySub}
                />
            </>
        )
    }

    const updateSubArray = (num?: number) => {
        const updArray: boolean[] = []
        if (!num) {
            subCategorias.map(() => {
                updArray.push(false)
            })
        } else {
            updateArray.map((x) => {
                updArray.push(x)
            })
            updArray[num] = !updArray[num]
        }
        return updArray
    }

    const [updateArray, setUpdateArray] = useState(updateSubArray())

    return (
        <div className={cx("largecard__container", containerClassName)}>
            <div className={cx("card", className)}>
                {status ? (
                    <div className="largecard-left-added">
                        <div className="card-content-line-added-edit">
                            <div>
                                <p className="card-header-title" style={{ marginBottom: 20 }}>
                                    {title}
                                </p>
                                <p className="card-content-line-title-edit">Límite mensual de gasto:</p>
                                <InputText
                                    type="number"
                                    icon={coinMoney}
                                    className="card-content-line-input"
                                    style={{ border: "1px solid #959595" }}
                                    placeholder="Agrega un monto"
                                    value={newLimite}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setNewLimite(value.replace(/[^\d.]/g, ""))
                                    }}
                                />
                            </div>
                            <p className="card-content-line-title" style={{ marginTop: 66 }}>
                                Presupuesto disponible:
                            </p>
                            <p className="card-content-line-subtitle" style={{ marginTop: 66 }}>
                                {limiteMensual === "0" ? "N/A" : presupuesto ? "$" + presupuesto : "Sin asignar"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="largecard-left">
                        <div className="largecard-left-top">
                            <p className="card-header-title">{title}</p>
                            <p className="card-header-subtitle">{subtitle}</p>

                            <div className="card-content-line">
                                <p className="card-content-line-title">Límite mensual de gasto:</p>
                                <p className="card-content-line-subtitle">
                                    {limiteMensual !== "0" ? "$" + limiteMensual : "Sin asignar"}
                                </p>
                                <p className="card-content-line-title">Presupuesto disponible:</p>
                                <p className="card-content-line-subtitle">
                                    {limiteMensual === "0" ? "N/A" : presupuesto ? "$" + presupuesto : "Sin asignar"}
                                </p>
                            </div>
                        </div>
                        {subFiltered?.length === 0 && (
                            <div className="largecard-left-bottom">
                                <div
                                    onClick={() => setAddSub(true)}
                                    style={{ marginTop: 30 }}
                                    className="card-content-line-edit-subcategoria"
                                >
                                    <Icon color="var(--primary)" name={"plusCircle"} />
                                    <p>Agregar subcategoría</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="largecard-right">
                    {!status && (
                        <div
                            style={{ display: title === "Propinas" ? "none" : "flex" }}
                            className="largecard-button"
                            onClick={() => {
                                setStatus(true)
                                setIsExpanded(!isExpanded)
                            }}
                        >
                            <Icon name="pencil" className="largecard-button-icon" />
                        </div>
                    )}
                    {!!status && (
                        <div
                            style={{ display: title === "Propinas" ? "none" : "flex" }}
                            className="largecard-button"
                            onClick={() => {
                                onEdit()
                            }}
                        >
                            <Icon name="save3Fill" className="largecard-button-icon" />
                        </div>
                    )}
                    <div
                        style={{ display: title === "Propinas" ? "none" : "flex" }}
                        className="largecard-button"
                        onClick={() => {
                            setDeleteModal(true)
                        }}
                    >
                        <Icon
                            name="trashFilled"
                            className="largecard-button-icon"
                            onClick={() => setDeleteModal(true)}
                        />
                    </div>
                    {subFiltered && subFiltered?.length > 0 && (
                        <div className="chevroUp-button" onClick={() => setIsExpanded(!isExpanded)}>
                            <Icon
                                width={"35px"}
                                height={"35px"}
                                name="chevronUp"
                                className={"drop"}
                                style={{
                                    transform: ` ${isExpanded ? "translateX(-40%)" : ""} rotate(${
                                        isExpanded ? "-180deg" : "0deg"
                                    })`,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {isExpanded && (
                <div>
                    <div className="card-content__containerSubGrup">
                        {subCategorias.map((subcategoria, index) => (
                            <div
                                style={{ display: subcategoria.eliminado ? "none" : "flex" }}
                                key={index}
                                className={`${
                                    array.includes(subcategoria.subcategoria_gasto_id) && !!status
                                        ? "subCatgoria-pil-selected"
                                        : "subCatgoria-pil"
                                }`}
                            >
                                <p>{subcategoria.subcategoria}</p>
                                {!!status && (
                                    <Icon
                                        name="xclose"
                                        color={`${
                                            array.includes(subcategoria.subcategoria_gasto_id) ? "#fff" : "#fff"
                                        }`}
                                        className={`subCatgoria-pil__icon`}
                                        onClick={() => {
                                            toggleSelected(subcategoria.subcategoria_gasto_id)
                                            setUpdateArray(updateSubArray(index))
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div
                        onClick={() => setAddSub(true)}
                        style={{ marginTop: 30, display: title === "Propinas" ? "none" : "flex" }}
                        className="card-content-line-edit-subcategoria"
                    >
                        <Icon color="var(--primary)" name={"plusCircle"} />
                        <p>Agregar subcategoría</p>
                    </div>
                </div>
            )}
            {addEdith && <SendDataEdith />}
            <DeletCategoriaModal
                id={id}
                title={title}
                presupuesto={presupuesto}
                open={deleteMod}
                onClose={() => setDeleteMode(false)}
                onSub={(value) => onSubDelete(value)}
            />
            <ModalDeleteCat
                open={deleteModal}
                id={id}
                onClose={() => setDeleteModal(false)}
                onSub={(value) => onSubDelete(value)}
                title={title}
                presupuesto={presupuesto}
            />
            {!!addSub && <AddSubCat id={id} onClose={() => setAddSub(false)} onSub={(value) => onSubAdd(value)} />}
        </div>
    )
}

export default LargeCard
