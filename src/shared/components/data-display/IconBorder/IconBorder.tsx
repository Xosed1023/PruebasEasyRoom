import React, { CSSProperties, MouseEvent } from "react"

import "./IconBorder.css"

const IconBorder = ({
    children,
    primaryBgColor,
    primaryBgDiameter,
    secondaryBgColor,
    secondaryBgDiameter,
    terciaryBgColor,
    terciaryBgDiameter,
    className,
    style,
    onClick,
}: {
    children?: JSX.Element
    primaryBgColor: string
    primaryBgDiameter: number | string
    secondaryBgColor?: string
    secondaryBgDiameter?: number | string
    terciaryBgColor?: string
    terciaryBgDiameter?: number | string
    className?: string
    style?: CSSProperties
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
}) => {
    return (
        <>
            {!!terciaryBgColor || !!terciaryBgDiameter ? (
                <div
                    className={`icon-border-center ${className || ""}`}
                    style={{
                        backgroundColor: terciaryBgColor,
                        height: terciaryBgDiameter,
                        width: terciaryBgDiameter,
                        ...style,
                    }}
                    onClick={onClick}
                >
                    {!!secondaryBgColor || !!secondaryBgDiameter ? (
                        <div
                            className="icon-border-center"
                            style={{
                                backgroundColor: secondaryBgColor,
                                height: secondaryBgDiameter,
                                width: secondaryBgDiameter,
                            }}
                        >
                            <div
                                className="icon-border-center"
                                style={{
                                    backgroundColor: primaryBgColor,
                                    height: primaryBgDiameter,
                                    width: primaryBgDiameter,
                                }}
                            >
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="icon-border-center"
                            style={{
                                backgroundColor: primaryBgColor,
                                height: primaryBgDiameter,
                                width: primaryBgDiameter,
                            }}
                        >
                            {children}
                        </div>
                    )}
                </div>
            ) : !!secondaryBgColor || !!secondaryBgDiameter ? (
                <div
                    className={`icon-border-center ${className || ""}`}
                    style={{
                        backgroundColor: secondaryBgColor,
                        height: secondaryBgDiameter,
                        width: secondaryBgDiameter,
                        ...style,
                    }}
                    onClick={onClick}
                >
                    <div
                        className="icon-border-center"
                        style={{ backgroundColor: primaryBgColor, height: primaryBgDiameter, width: primaryBgDiameter }}
                    >
                        {children}
                    </div>
                </div>
            ) : (
                <div
                    className={`icon-border-center ${className || ""}`}
                    style={{
                        backgroundColor: primaryBgColor,
                        height: primaryBgDiameter,
                        width: primaryBgDiameter,
                        ...style,
                    }}
                    onClick={onClick}
                >
                    {children}
                </div>
            )}
        </>
    )
}

export default IconBorder
