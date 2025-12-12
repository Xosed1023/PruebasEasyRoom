// import SkeletonCardXS from "./SkeletonCard/SkeletonCardXS"
import SkeletonCardXS from "./SkeletonCard/SkeletonCardXS.png"
import SkeletonCardSM from "./SkeletonCard/SkeletonCardSM.png"
import SkeletonCardMD from "./SkeletonCard/SkeletonCardMD.png"
import SkeletonCardLG from "./SkeletonCard/SkeletonCardLG.png"
import SkeletonCardXL from "./SkeletonCard/SkeletonCardXL.png"
import "./SkeletonCards.css"
import { useRef, useState } from "react"
import { ROOMS_LENGTH_SKELETON } from "src/shared/constants/localStorage"
import { useSetSkeletonCardSize } from "./hooks/useSetSkeletonCardSize"

function SkeletonCards(): JSX.Element {
    const containerRef = useRef(null)
    const [roomsLength] = useState(Number(localStorage.getItem(ROOMS_LENGTH_SKELETON) || 30))

    const { size } = useSetSkeletonCardSize(containerRef)

    return (
        <div className="home-screen-skeleton-container" ref={containerRef}>
            <div className="room-skeleton-cards">
                {Array.from({ length: roomsLength }, (_, index) => index).map((index) =>
                    size === "xs" ? (
                        <img width={106} height={70} src={SkeletonCardXS} key={index} />
                    ) : size === "sm" ? (
                        <img width={129} height={92} src={SkeletonCardSM} key={index} />
                    ) : size === "md" ? (
                        <img width={161} height={118} src={SkeletonCardMD} key={index} />
                    ) : size === "lg" ? (
                        <img width={263} height={103} src={SkeletonCardLG} key={index} />
                    ) : size === "xl" ? (
                        <img width={264} height={242} src={SkeletonCardXL} key={index} />
                    ) : size === "mxl" ? (
                        <img width={264} height={242} src={SkeletonCardXL} key={index} />
                    ) : null
                )}
            </div>
        </div>
    )
}

export default SkeletonCards
