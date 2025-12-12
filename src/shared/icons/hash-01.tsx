import { IconNamesProps } from "./Icon"

const hash01 = ({ color = "#0E0E0E", ...rest }: IconNamesProps) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.11 2.006a1 1 0 01.884 1.104L10.45 8h3.987l.568-5.11a1 1 0 011.988.22L16.45 8H20a1 1 0 110 2h-3.772l-.444 4H20a1 1 0 110 2h-4.438l-.568 5.11a1 1 0 11-1.988-.22L13.55 16H9.562l-.568 5.11a1 1 0 11-1.988-.22L7.55 16H4a1 1 0 110-2h3.772l.444-4H4a1 1 0 010-2h4.438l.568-5.11a1 1 0 011.104-.884zM13.772 14l.444-4h-3.988l-.444 4h3.988z"
            fill={color}
        />
    </svg>
)

export default hash01
