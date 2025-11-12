import React, { useEffect, useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import { InputText } from "src/shared/components/forms"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"
import { useGetEasyrewardsLazyQuery } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "./ModalEasyrewards.css"

interface ModalEasyrewardsProps {
    isOpen: boolean
    onClose: () => void
    titleEasyrewards?: string
    descriptionEasyrewards?: string
    buttonTextEasyrewards?: string
}

const ModalEasyrewards: React.FC<ModalEasyrewardsProps> = ({
    isOpen,
    onClose,
    titleEasyrewards = "Puntos Easyrewards",
    descriptionEasyrewards = "Revisa el saldo de puntos Easyrewards acumulados por tus huéspedes.",
    buttonTextEasyrewards = "Buscar",
}) => {
    const [idEasyrewards, setIdEasyrewards] = useState<string>("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [data, setData] = useState<any>()

    const [getEasyrewards, { loading }] = useGetEasyrewardsLazyQuery()

    const header = [{ value: "ID" }, { value: "Love Points" }]
    const { showSnackbar } = useSnackbar()

    const handleClear = () => {
        setIdEasyrewards("")
        setSearchResults([])
        setIsSearching(false)
    }

    const handleSearch = () => {
        setIsSearching(true)
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleSearch()
        }
    }

    useEffect(() => {
        if (isSearching && !loading) {
            const saldo = data?.obten_saldo?.saldo
            setSearchResults(saldo ? [{ id: idEasyrewards, saldo }] : [])
        }
        if (!isOpen) handleClear()
    }, [data, isOpen, loading, isSearching])

    useEffect(() => {
        if (idEasyrewards) {
            getEasyrewards({
                variables: {
                    easyrewards_id: idEasyrewards,
                },
            })
                .then(({ data }) => {
                    setData(data)
                })
                .catch(() => {
                    showSnackbar({
                        title: "Error al consultar puntos",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    setData(null)
                    setIsSearching(false)
                })
        }
    }, [idEasyrewards])

    return (
        <Modal isOpen={isOpen} withCloseButton={true} onClose={onClose} width="572px">
            <div className="modal-easyrewards">
                <div className="modal-easyrewards__general">
                    <div className="modal-easyrewards__header">
                        <Icon name="giftFill" color="var(--purple-drawer-primario)" width={70} height={70} />
                    </div>
                    <h2 className="modal-easyrewards__title">{titleEasyrewards}</h2>
                    <p className="modal-easyrewards__description">{descriptionEasyrewards}</p>
                    <div className="modal-easyrewards__search">
                        <InputText
                            icon={Icon}
                            iconProps={{ name: "searchLg", color: "var(--primary)" }}
                            className="modal-easyrewards__search__input"
                            type={"text"}
                            placeholder="Busca por ID"
                            value={idEasyrewards}
                            onChange={(e) => setIdEasyrewards(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {idEasyrewards && (
                            <div className="modal-easyrewards__clear-icon" onClick={handleClear}>
                                <Icon name="close" color="var(--primary)" />
                            </div>
                        )}
                    </div>

                    {isSearching &&
                        !loading &&
                        (searchResults.length > 0 ? (
                            <div className="modal-easyrewards__table">
                                <FlexibleTable
                                    tableItems={{
                                        headers: header,
                                        rows: searchResults.map((result) => ({
                                            value: [{ value: result.id }, { value: result.saldo }],
                                        })),
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="modal-easyrewards__content-empty">
                                <Empty
                                    className="modal-easyrewards__empty"
                                    title="No sé encontraron resultados"
                                    description="No se encontró el ID de membresía. Por favor, intenta nuevamente con otro ID."
                                    icon="searchLg"
                                />
                            </div>
                        ))}

                    <div className="modal-easyrewards__divider"></div>

                    <Button
                        onClick={handleSearch}
                        className={`modal-easyrewards__action-button ${
                            isSearching || !idEasyrewards ? "disabled" : ""
                        }`}
                        text={buttonTextEasyrewards}
                        disabled={isSearching}
                    />
                </div>
            </div>
        </Modal>
    )
}
export default ModalEasyrewards
