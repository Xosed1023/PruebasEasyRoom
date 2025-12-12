import React from "react"

import "./DescriptionDetailList.css"
import Icon, { COLLECTION } from "src/shared/icons/Icon"
import { v4 as uuid } from "uuid"

const DescriptionDetailList = ({
    iconName,
    subtitle,
    title,
    values,
    link,
    onLink,
}: {
    iconName: keyof typeof COLLECTION | (string & {})
    title: string
    subtitle: string
    values: string[]
    link?: string
    onLink?: () => void
}) => {
    return (
        <div className="description-detail-list__wrapper">
            <div className="description-detail-list__header">
                <div className="description-detail-list__header__main">
                    <Icon name={iconName} width={16} height={16} color="var(--white)" />
                    <span className="description-detail-list__header__text">{title}</span>
                </div>
                <span className="description-detail-list__header__text">{subtitle}</span>
            </div>
            {!!link && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                    }}
                >
                    <span className="description-detail-list__header__text--link" onClick={() => onLink?.()}>
                        {link}
                    </span>
                </div>
            )}
            <div className="description-detail-list__body">
                {values.map((v) => (
                    <span key={uuid()} className="description-detail-list__body__text">
                        {v}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default DescriptionDetailList
