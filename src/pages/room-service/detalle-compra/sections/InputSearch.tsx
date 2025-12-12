import { useState, useEffect, useRef, useCallback } from "react"
import CheckSvg from "src/shared/icons/checkDropdown"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import { InputNumberProps } from "../DetalleCompra.type"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { debounce } from "src/utils/lodash"
import { gql } from "@apollo/client"
import { client } from "src/graphql"
import { useProfile } from "src/shared/hooks/useProfile"

const GET_ROOMS = gql`
    query Habitaciones($hotel_id: ID) {
        habitaciones(hotel_id: $hotel_id) {
            habitacion_id
            numero_habitacion
            tipo_habitacion_id
            tipo_habitacion {
                nombre
            }
            ultima_renta {
                renta_id
                pagos {
                    detalles_pago {
                        easyrewards_id
                    }
                }
            }
        }
    }
`

const InputSearch = ({ onChange, error = false, value = "" }: InputNumberProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [lvalue, setValue] = useState<string>("")
    const [lError, setError] = useState<string>("")
    const [list, setList] = useState<any[]>([])
    const [rooms, setRooms] = useState<any[]>([])

    const { hotel_id, usuario_id } = useProfile()
    const ref = useRef<HTMLDivElement>(null)

    useEffectMouseDown(ref, () => setVisible(false))

    useEffect(() => {
        if (error) handleEffect()
    }, [error])

    const fetchData = async (value: string) => {
        const { data } = await client.query({ query: GET_ROOMS, variables: { hotel_id, usuario_id } })

        const results: any[] = []

        const occupiedRooms = data?.habitaciones?.filter(({ ultima_renta }) => ultima_renta?.renta_id) || []

        occupiedRooms.forEach(({ tipo_habitacion, numero_habitacion, ultima_renta }) => {
            const localText = `${numero_habitacion}`.slice(0, value.length)
            if (value && localText.includes(value)) {
                const roomName = `${tipo_habitacion?.nombre} ${numero_habitacion}`
                const rentaId = ultima_renta?.renta_id
                results.push({ nombre: roomName, id: rentaId, numero_habitacion })
            }
        })

        if (results.length > 0) {
            setList(results)
            setVisible(true)
        } else {
            setList([])
            setVisible(false)
            if (value) onChange("")
        }

        setRooms(data?.habitaciones)
    }

    const handleSelect = (label: string, id: string) => {
        setValue(label)
        onChange(id)
        setVisible(false)
    }

    const handleSearch = useCallback(
        debounce((value: string) => fetchData(value), 500),
        []
    )

    const handleEffect = (onConfirm?: (label: string, id: string) => void | undefined) => {
        if (lvalue) {
            const find = rooms.find(({ numero_habitacion }) => numero_habitacion === lvalue)
            if (find) {
                const rentaId = find?.ultima_renta?.renta_id
                if (rentaId) {
                    setError("")
                    if (onConfirm) onConfirm(lvalue, rentaId)
                } else {
                    setError("No se entrega room service en habitaciones desocupadas")
                }
            } else {
                setError(`No se encontró la habitación ${lvalue}`)
            }
        } else {
            setError("Escribe una habitación")
        }
    }

    return (
        <div className="detalle-compra__input-text detalle-compra__search">
            <InputText
                icon={Icon}
                iconProps={{
                    name: "habitacion",
                    width: 16,
                    height: 16,
                }}
                type="text"
                placeholder="Escribe el número de habitación"
                label="Número de habitación"
                value={lvalue}
                onChange={(e) => {
                    const value = `${e.target.value}`.replace(/[^\d]/g, "")
                    setValue(value)
                    handleSearch(value)

                    if (lError) setError("")
                }}
                onFocus={() => {
                    if (!visible && list.length > 0) setVisible(true)
                }}
                //onBlur={() => handleEffect()}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        setVisible(false)
                        handleEffect(handleSelect)
                    }
                }}
                error={lError.length > 0}
                errorhinttext={lError}
            />
            {visible && (
                <div ref={ref} className="detalle-compra__search-box">
                    {list.map(({ nombre = "", id = "", numero_habitacion = "" }, index) => (
                        <div
                            className={
                                "detalle-compra__search-item" +
                                (id && value === id ? " detalle-compra__search-item--active" : "")
                            }
                            key={index}
                            onClick={() => {
                                handleSelect(numero_habitacion, id)
                                if (lError) setError("")
                            }}
                        >
                            {nombre}
                            {id && value === id ? (
                                <CheckSvg
                                    className="detalle-compra__search-item-icon"
                                    color="var(--deep-purple)"
                                    width="20px"
                                    height="12px"
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default InputSearch
