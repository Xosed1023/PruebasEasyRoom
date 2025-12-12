import React from "react"

import "./ExtraTimeWrapper.css"
import Icon from "src/shared/icons"
import { COLLECTION } from "src/shared/icons/Icon"

const ExtraTimeWrapper = ({ extraTime = 0, entry, entryIcon, elsapedTime }: { extraTime: number, entry: string, entryIcon: keyof typeof COLLECTION | (string & {}), elsapedTime: string }) => {
    return (
        <div className="room-card--lg--extra-time-wrapper__body">
            <div className="room-card--lg--extra-time-wrapper__description-wrapper">
                <div className="room-card--lg--extra-time-wrapper__description">
                    <Icon name={"UserParentFill"} width={12} height={12} color={"var(--tipografa)"} />
                    <span className="room-card--lg--extra-time-wrapper__description-text">2</span>
                </div>
                <div className="room-card--lg--extra-time-wrapper__description">
                    <Icon name={"timer"} width={12} height={12} color={"var(--tipografa)"} />
                    <span className="room-card--lg--extra-time-wrapper__timer">{elsapedTime}</span>
                </div>
            </div>
            <div className="room-card--lg--extra-time-wrapper__description-wrapper">
                <div className="room-card--lg--extra-time-wrapper__description" style={{display: 'flex', justifyContent: 'end'}}>
                    <Icon name={entryIcon} width={12} height={12} color={"var(--tipografa)"} />
                    <span className="room-card--lg--extra-time-wrapper__description-extra">{entry}</span>
                </div>
                <div className="room-card--lg--extra-time-wrapper__description">
                    <span className="room-card--lg--extra-time-wrapper__description-extra">
                        {/* extraTime aqui va esto */}
                        Extra: -{`${extraTime}:00:00`}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ExtraTimeWrapper
