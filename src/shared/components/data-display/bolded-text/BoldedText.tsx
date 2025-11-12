import { Props } from "./BoldedText.type"

const getString = (text: string, boldClassName?: string, boldColor?: string) => {
    const bold = /\*\*(.*?)\*\*/gm
    return text.replace(bold, `<strong style="color: ${boldColor}" class=${boldClassName}>$1</strong>`)
}

function BoldedText({ className = "", style = {}, children = "", boldClassName = "", color = "", boldColor = "" }: Props): JSX.Element {
    return (
        <p
            className={className}
            style={{ ...style, color: color || style?.color }}
            dangerouslySetInnerHTML={{ __html: getString(children, boldClassName, boldColor || color) }}
        />
    )
}

export default BoldedText
