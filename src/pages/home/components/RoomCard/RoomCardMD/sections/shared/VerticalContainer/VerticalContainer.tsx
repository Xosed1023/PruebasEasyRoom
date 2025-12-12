import React, { ReactNode } from 'react'

import './VerticalContainer.css'

const VerticalContainer = ({ children }: { children: ReactNode }) => {
    return (
        <div className="room-card--md__vertical-container">
            {children}
        </div>
    )
}

export default VerticalContainer