import React, { CSSProperties, useMemo } from "react"
// import { useDoubleTap } from "src/shared/hooks/useHandleDoubleTap"
import { RoomStatusProps } from "./interfaces/RoomStatusProps.interface"
import { RoomStatus } from "./enums/RoomStatus.enum"
import { useProfile } from "src/shared/hooks/useProfile"

import "./RoomCard.css"
import RoomCardLG from "./RoomCardLG/RoomCardLG"
import RoomCardMD from "./RoomCardMD/RoomCardMD"
import RoomCardMXL from "./RoomCardMXL/RoomCardMXL"
import RoomCardSM from "./RoomCardSM/RoomCardSM"
import RoomCardXL from "./RoomCardXL/RoomCardXL"
import RoomCardXS from "./RoomCardXS/RoomCardXS"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useMaxHeightContext } from "./RoomCardXS/hooks/useMaxHeight"

export type RoomCardSizes = "xs" | "sm" | "md" | "lg" | "mxl" | "xl"

export interface RoomCardProps extends RoomStatusProps {
    size: RoomCardSizes
    isSelected?: boolean
    onSelect?: () => void
    style?: CSSProperties
}

const RoomCard = ({ size, isSelected, onSelect = undefined, ...props }: RoomCardProps) => {
    const { rolName } = useProfile()
    const { maxHeight } = useMaxHeightContext()

    const isClickable =
        (rolName === RoleNames.valet &&
            (props.roomStatus === RoomStatus.occupied ||
                props.roomStatus === RoomStatus.roomService ||
                props.roomStatus === RoomStatus.reserved ||
                props.roomStatus === RoomStatus.available ||
                props.roomStatus === RoomStatus.clean)) ||
        (rolName === RoleNames.roomService && props.roomStatus === RoomStatus.occupied) ||
        (rolName !== RoleNames.valet && rolName !== RoleNames.roomService)

    // const doubleTapHandler = useDoubleTap(() => {
    //     setTimeout(() => {
    //         onSelect?.()
    //     }, 10);
    // })

    const cardSize = useMemo(() => {
        switch (size) {
            case "xl":
                return <RoomCardXL {...props} isSelected={isSelected} />
            case "lg":
                return <RoomCardLG {...props} isSelected={isSelected} />
            case "md":
                return <RoomCardMD {...props} isSelected={isSelected} />
            case "sm":
                return <RoomCardSM {...props} isSelected={isSelected} />
            case "xs":
                return <RoomCardXS {...props} isSelected={isSelected} />
            case "mxl":
                return <RoomCardMXL {...props} isSelected={isSelected} />
            default:
                return <></>
        }
    }, [size, props])

    return (
        <div
            className="room-card"
            style={{ ...props.style, maxHeight }}
            onClick={isClickable ? onSelect : undefined}
        >
            {cardSize}
        </div>
    )
}

export default RoomCard
