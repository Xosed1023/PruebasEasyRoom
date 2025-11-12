
export interface BooleanButtonProps {
    textTrue?: string;
    textFalse?: string;
    label?: string;
    value?: boolean;
    classButtons?: string;
    className?: string;
    onChange?: (value: boolean) => void;
}