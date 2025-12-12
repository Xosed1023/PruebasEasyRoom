import { MouseEvent } from "react"

const SimpleResizableCheckbox = ({
    width = 20,
    height = 20,
    onChange,
    value,
    minusIconOnActive = false,
    onClick
}: {
    width?: number | string
    height?: number | string
    onChange?: (value: boolean) => void
    minusIconOnActive?: boolean
    onClick?: (e: MouseEvent) => void
    value: boolean
}) => {

    return (
        <>
            {value ? (
                minusIconOnActive ? (
                    <svg
                        width={width}
                        height={height}
                        viewBox="0 0 15 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={(e) => {
                            onChange?.(false)
                            onClick?.(e)
                        }}
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.5 2.375H12.5C12.6658 2.375 12.8247 2.44085 12.9419 2.55806C13.0592 2.67527 13.125 2.83424 13.125 3V13C13.125 13.1658 13.0592 13.3247 12.9419 13.4419C12.8247 13.5592 12.6658 13.625 12.5 13.625H2.5C2.33424 13.625 2.17527 13.5592 2.05806 13.4419C1.94085 13.3247 1.875 13.1658 1.875 13V3C1.875 2.83424 1.94085 2.67527 2.05806 2.55806C2.17527 2.44085 2.33424 2.375 2.5 2.375ZM7.5 7.5H10.5V8.5H7.5H4.5V8V7.5H7.5Z"
                            fill="#6941C6"
                        />
                    </svg>
                ) : (
                    <svg
                        width={width}
                        height={height}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={(e) => {
                            onChange?.(false)
                            onClick?.(e)
                        }}
                    >
                        <path
                            d="M3.33333 2.5H16.6667C16.8877 2.5 17.0996 2.5878 17.2559 2.74408C17.4122 2.90036 17.5 3.11232 17.5 3.33333V16.6667C17.5 16.8877 17.4122 17.0996 17.2559 17.2559C17.0996 17.4122 16.8877 17.5 16.6667 17.5H3.33333C3.11232 17.5 2.90036 17.4122 2.74408 17.2559C2.5878 17.0996 2.5 16.8877 2.5 16.6667V3.33333C2.5 3.11232 2.5878 2.90036 2.74408 2.74408C2.90036 2.5878 3.11232 2.5 3.33333 2.5ZM9.16917 13.3333L15.0608 7.44083L13.8825 6.2625L9.16917 10.9767L6.81167 8.61917L5.63333 9.7975L9.16917 13.3333Z"
                            fill="#6941C6"
                        />
                    </svg>
                )
            ) : (
                <svg
                    width={width}
                    height={height}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={(e) => {
                        onChange?.(true)
                        onClick?.(e)
                    }}
                >
                    <path
                        d="M3.33333 3H16.6667C16.7551 3 16.8399 3.03512 16.9024 3.09763C16.9649 3.16014 17 3.24493 17 3.33333V16.6667C17 16.7551 16.9649 16.8399 16.9024 16.9024C16.8399 16.9649 16.7551 17 16.6667 17H3.33333C3.24493 17 3.16014 16.9649 3.09763 16.9024C3.03512 16.8399 3 16.7551 3 16.6667V3.33333C3 3.24493 3.03512 3.16014 3.09763 3.09763C3.16014 3.03512 3.24493 3 3.33333 3Z"
                        fill="white"
                        stroke="#667085"
                    />
                </svg>
            )}
        </>
    )
}

export default SimpleResizableCheckbox
