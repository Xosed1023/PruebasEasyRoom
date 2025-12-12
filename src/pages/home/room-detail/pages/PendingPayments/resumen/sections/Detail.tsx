import React from "react"

const Detail = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="room-detail__page--checkout__total--thin">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    )
}

export default Detail
