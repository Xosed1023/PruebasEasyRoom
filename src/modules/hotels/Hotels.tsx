import { useEffect, useState } from "react"
import Screen from "@/components/core/layout/screen/Screen"
import CardHotel from "./components/card-hotel/CardHotel"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import { useNavigate } from "react-router"
import Header from "./components/header/Header"
import EmptyImg from "assets/png/empty-expiracion.png"
import { useProfile } from "@/hooks/store/useProfile"
import styles from "./Hotels.module.css"

const default_hoteles = [0, 1, 2, 3, 4, 5, 6, 7, 8]

const Hotels = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    const { usuario, handleHotel } = useProfile()
    const hoteles = usuario?.hotel || []

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    return (
        <Screen className="mt-[24px]" header={<Header onLogout={() => setLoading(true)} />}>
            {!loading ? (
                hoteles.length > 0 ? (
                    <div>
                        <SectionTitle title="¿Qué hotel deseas consultar?" />
                        <div className="grid grid-cols-2 gap-x-[16px] h-full gap-y-[20px] mt-[24px] pb-[30px]">
                            {hoteles?.map((h, index) => (
                                <CardHotel
                                    key={index}
                                    onSelect={() => {
                                        handleHotel({
                                            nombre_hotel: h?.nombre_hotel || "",
                                            hotel_id: h?.hotel_id || "",
                                            logo_hotel: h?.logo_hotel || "",
                                            zona_horaria: h?.zona_horaria || "",
                                        })
                                        navigate(`/u/home/${h.hotel_id}`)
                                    }}
                                    title={h?.nombre_hotel || ""}
                                    src={h?.logo_hotel || ""}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles["hotels__empty"]}>
                        <div className={styles["hotels__empty-img"]}>
                            <img height={200} src={EmptyImg} alt={"logo"} />
                        </div>
                        <p className={styles["hotels__empty-title"]}>{"No tienes hoteles"}</p>
                    </div>
                )
            ) : (
                <div>
                    <SectionTitle title="¿Qué hotel deseas consultar?" />
                    <div className="grid grid-cols-2 gap-x-[16px] h-full gap-y-[20px] mt-[24px] pb-[30px]">
                        {default_hoteles.map((v) => (
                            <CardHotel key={v} onSelect={() => null} title={""} src={""} isLoading={true} />
                        ))}
                    </div>
                </div>
            )}
        </Screen>
    )
}

export default Hotels
