import React from "react"

const DetailBold = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="room-detail__page--checkout__total--bold">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    )
}

export default DetailBold
