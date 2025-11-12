import React from "react"

import "./AvatarsCollapsable.css"
import { v4 as uuid } from "uuid"

const AvatarsCollapsable = ({
    imageUrls = [],
    imageSize = 30,
    borderColor = "var(--white)",
}: {
    imageUrls: string[]
    imageSize?: number
    borderColor?: string
}) => {
    return (
        <div className="avatar-collapse__image__container">
            {imageUrls.map((img) => (
                <img
                    src={img || require("src/assets/webp/profile_default.webp")}
                    key={uuid()}
                    width={imageSize}
                    height={imageSize}
                    className="avatar-collapse__image"
                    style={{ border: imageUrls.length > 1 ? "" : "none", borderColor }}
                />
            ))}
        </div>
    )
}

export default AvatarsCollapsable
