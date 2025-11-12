import { IconProps } from "./interfaces/IconProps.interface";

export const IconTrash = ({ color, ...props }: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size === "ch" ? 20 : 24}
            height={props.size === "ch" ? 20 : 24}
            fill="none"
            {...{
                ...props,
                style: {
                    width: 20,
                    textAlign: "center",
                    transform: `scale(${props.size === "ch" ? 1 : 1.2})`
                },
            }}
        >
            <path
                stroke={color || "#000000"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5.5v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C12.48 1.5 11.92 1.5 10.8 1.5H9.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C6 3.02 6 3.58 6 4.7v.8M8 11v5m4-5v5M1 5.5h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 19.22 3 18.38 3 16.7V5.5"
            />
        </svg>
    )
}

export default IconTrash
