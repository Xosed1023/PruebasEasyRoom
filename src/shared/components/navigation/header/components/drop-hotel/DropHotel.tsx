import { useState, useCallback, forwardRef } from "react"
import { createPortal } from "react-dom"
import cx from "classnames"
import { useProfile } from "src/shared/hooks/useProfile"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import IconCheck from "src/shared/icons/check"
import SerachLg from "src/shared/icons/SearchLg"
import Close from "src/shared/icons/Close"
import { debounce } from "src/utils/lodash"
import "./DropHotel.css"

const empty_hoteles = [1, 2, 3, 4, 5, 6, 7, 8]

type DropHotelProps = {
    onChange: (value: string) => void
}

const DropHotel = forwardRef(({ onChange }: DropHotelProps, ref: any) => {
    const { myProfile, hotel_id } = useProfile()

    const hotel_lista = (myProfile?.hotel || []).map((item) => {
        return {
            ...item,
            selected: item.hotel_id === hotel_id,
        }
    })

    const max_hoteles = hotel_lista.length > 8

    const orderList = (array: typeof hotel_lista): typeof hotel_lista | any => {
        const selected: typeof hotel_lista = []
        const values: typeof hotel_lista = []

        array.forEach((item) => {
            if (item.selected) {
                selected.push(item)
            } else {
                values.push(item)
            }
        })

        return [...selected, ...values.sort((a, b) => a.nombre_hotel.localeCompare(b.nombre_hotel))]
    }

    const [search, setSearch] = useState<string>("")
    const [load, setLoad] = useState<boolean>(false)
    const [hoteles, setHoteles] = useState<typeof hotel_lista>(orderList(hotel_lista))

    const fetchData = (value: string) => {
        const filter = hotel_lista.filter(({ nombre_hotel = "" }) => {
            const localText = `${nombre_hotel}`.slice(0, value.length)
            return value && localText.includes(value)
        })
        setHoteles(orderList(value ? filter : hotel_lista))
        setLoad(false)
    }

    const handleSearch = useCallback(
        debounce((value: string) => fetchData(value), 500),
        []
    )

    return createPortal(
        <div className="drop-hotel" ref={ref}>
            {max_hoteles && (
                <div className="drop-hotel__header">
                    <div className="drop-hotel__search">
                        <SerachLg height={18} width={18} color={"var(--white)"} />
                        <input
                            className="drop-hotel__input"
                            placeholder="Busca por nombre de hotel"
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value || ""
                                setLoad(true)
                                setSearch(value)
                                handleSearch(value)
                            }}
                        />
                        {search && (
                            <div
                                onClick={() => {
                                    setSearch("")
                                    setHoteles(hotel_lista)
                                }}
                                className="drop-hotel__close"
                            >
                                <Close height={10} width={10} color={"var(--primary)"} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div
                className={cx({
                    ["drop-hotel__main"]: true,
                    ["drop-hotel__main-max"]: max_hoteles,
                })}
            >
                {!load ? (
                    hoteles.length > 0 ? (
                        <>
                            {hoteles.map(
                                ({ selected = false, nombre_hotel = "", logo_hotel = "", hotel_id = "" }, index) => (
                                    <div className="drop-hotel__item" key={index} onClick={() => onChange(hotel_id)}>
                                        <div className="drop-hotel__item-content">
                                            <div className="drop-hotel__logo">
                                                {logo_hotel ? (
                                                    <img
                                                        className="drop-hotel__logo-img"
                                                        height={34}
                                                        width={34}
                                                        src={logo_hotel}
                                                        alt={nombre_hotel}
                                                    />
                                                ) : (
                                                    <span>
                                                        {`${nombre_hotel?.split(" ")?.[0]?.[0]} ${
                                                            nombre_hotel?.split(" ")?.[1]?.[0]
                                                        }`.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="drop-hotel__info">
                                                <p className="drop-hotel__name">{nombre_hotel}</p>
                                                {selected && (
                                                    <p className="drop-hotel__description">{"Hotel actual"}</p>
                                                )}
                                            </div>
                                        </div>
                                        {selected && (
                                            <div className="drop-hotel__check">
                                                <IconCheck width={10} height={6} color={"var(--white)"} />
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    ) : (
                        <div className="drop-hotel__empty">
                            <div className="drop-hotel__empty-cover">
                                <SerachLg height={76} width={76} color={"var(--white)"} />
                            </div>
                            <p className="drop-hotel__empty-title">{"Sin resultados"}</p>
                            <BoldedText
                                color={"var(--white)"}
                                className="drop-hotel__empty-description"
                            >{`No hay resultados para **'${search}'**. Intenta de nuevo.`}</BoldedText>
                        </div>
                    )
                ) : (
                    <>
                        {empty_hoteles.map((item) => (
                            <div className="drop-hotel__item drop-hotel__skeleton" key={item}>
                                <Skeleton.Item drawer={true} className="drop-hotel__skeleton__avatar" />
                                <Skeleton.Item drawer={true} className="drop-hotel__skeleton__name" />
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="drop-hotel__footer">
                <img src={require("src/assets/png/logo_opacity.png")} height={15} alt="logo" />
            </div>
        </div>,
        document.getElementById("drop-hotel") as HTMLElement
    )
})

export default DropHotel
