import { ReactNode, useRef } from "react";
import ReactDOM, { Root } from "react-dom/client";

let dropdownsBackground: Root | undefined = undefined;

interface ShowProps {
    children?: ReactNode;
    position?: { x: number | string; y: number | string };
}

const useDropdownsBackground = () => {
    const dropdownContentRef = useRef<HTMLDivElement | null>(null);

    const showDropdownsBackground = (props?: ShowProps) => {
        if (dropdownsBackground) {
            return;
        }
        dropdownsBackground = ReactDOM.createRoot(document.getElementById("dropdowns-background") as HTMLElement);
        dropdownsBackground.render(
            <div
                style={{
                    width: "100dvw",
                    height: "100dvh",
                    position: "fixed",
                    zIndex: "2000",
                    top: 0,
                    left: 0,
                }}
                onClick={() => {
                    dropdownsBackground?.unmount();
                    dropdownsBackground = undefined;
                }}
            >
                <div
                    ref={dropdownContentRef} // Asignar el ref aquí
                    onClick={(e) => e.stopPropagation()}
                    style={{ top: props?.position?.y, left: props?.position?.x, position: "fixed" }}
                >
                    {props?.children}
                </div>
            </div>
        );
    };

    const closeDropdownsBackground = () => {
        if(dropdownsBackground) {
            dropdownsBackground?.unmount();
            dropdownsBackground = undefined;
            dropdownContentRef.current = null
        }
    };

    return {
        showDropdownsBackground,
        closeDropdownsBackground,
        dropdownContentRef
    };
};

export default useDropdownsBackground;
