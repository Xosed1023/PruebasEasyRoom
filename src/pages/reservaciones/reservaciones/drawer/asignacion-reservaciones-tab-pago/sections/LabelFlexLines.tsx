import React, { CSSProperties } from 'react'

import './LabelFlexLines.css'

const LabelFlexLines = ({ label1, value1, label2, value2, label3, value3, style }: { label1: string, value1: string, label2?: string, value2?: string, label3?: string, value3?: string, style?: CSSProperties }) => {
    return (
        <div className="asignacion__reservaciones__drawer__tab__pay__total__item">
            <div className="signacion__reservaciones__drawer__tab__pay__total__line1">
                <span style={style}>{label1}</span>
                <span style={style}>{value1}</span>
            </div>
            {
                !!label2 && !!value2 &&
                <div className="signacion__reservaciones__drawer__tab__pay__total__line2">
                    <span>{label2}</span>
                    <span>{value2}</span>
                </div>
            }
            {
                !!label3 && !!value3 &&
                <div className="signacion__reservaciones__drawer__tab__pay__total__line2">
                    <span>{label3}</span>
                    <span>{value3}</span>
                </div>
            }
        </div>
    )
}

export default LabelFlexLines