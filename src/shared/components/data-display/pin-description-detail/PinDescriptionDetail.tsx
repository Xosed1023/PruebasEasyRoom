import React from 'react'
import Icon, { COLLECTION } from 'src/shared/icons/Icon'
import IconBorder from '../IconBorder/IconBorder'

import './PinDescriptionDetail.css'

interface PinDescriptionDetailProps {
    icon: keyof typeof COLLECTION | (string & {}),
    title: string,
    subtitle: string,
    description: string,
    actionIcon?: keyof typeof COLLECTION | (string & {})
    onClickActionIcon?: () => void
    price: string
}

const PinDescriptionDetail = ({
    actionIcon,
    icon,
    onClickActionIcon,
    description,
    price,
    subtitle,
    title
}: PinDescriptionDetailProps) => {
    return (
        <div className="pin-description-detail-row pin-description-detail-container">
            <div className="pin-description-detail-col pin-description-detail__pin-container">
                <IconBorder primaryBgColor='var(--white)' primaryBgDiameter="14px" >
                    <Icon name={icon} height={8} width={8}></Icon>
                </IconBorder>
                <div className='pin-description-detail__pin-line'></div>
            </div>
            <div className="pin-description-detail-row pin-description-detail-row--space-between">
                <div className="pin-description-detail-col">
                    <div className="pin-description-detail-row pin-description-detail-row__header">
                        <span className='pin-description-detail__title'>{title}</span>
                        <span className='pin-description-detail__description'>{description}</span>
                    </div>
                    <div className="pin-description-detail-row">
                        <span className='pin-description-detail__subtitle'>{subtitle}</span>
                    </div>
                </div>
                {!!actionIcon &&
                    <div className="pin-description-detail-col pin-description-detail-actions">
                        <Icon name={actionIcon} color="var(--white)" height={16} width={16} style={{ cursor: 'pointer' }} onClick={() => onClickActionIcon?.()} />
                        <span className='pin-description-detail__subtitle'>{price}</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default PinDescriptionDetail