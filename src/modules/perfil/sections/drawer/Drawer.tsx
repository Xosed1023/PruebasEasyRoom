import { useMemo } from "react"
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer/Drawer"
import cx from "classnames"
import Icon from "@/icons"
import { usePickerImages } from "@/hooks/native/usePickerImages"
import { DrawerImageProps } from "./Drawer.type"
import styles from "./Drawer.module.css"

const staticOptions = [
    { label: "Tomar foto", icon: "Camera", action: "camera" },
    { label: "Seleccionar foto", icon: "Picture", action: "picture" },
    { label: "Eliminar foto", icon: "Trash", action: "remove" },
]

function DrawerImage({ open, withRemove, onChange, onClose }: DrawerImageProps) {
    const { handlePickerImage, handleTakePicture } = usePickerImages({
        onChange: ({ file, url }) => onChange({ action: "file", payload: url, file }),
    })

    const options = useMemo(() => {
        return withRemove ? staticOptions : [staticOptions[0], staticOptions[1]]
    }, [withRemove])

    const onSelectItem = (action: string) => {
        onClose()
        const actions = {
            camera: handleTakePicture,
            picture: handlePickerImage,
            remove: () => onChange({ action: "remove", payload: "" }),
        }

        const onAction = actions[action]

        if (onAction) onAction()

        return
    }

    return (
        <Drawer open={open} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <h2 className={styles["drawer-image__title"]}>{"Editar foto de perfil"}</h2>
                </DrawerHeader>
                <div className={styles["drawer-image__options"]}>
                    {options.map(({ label = "", icon = "", action = "" }, index) => (
                        <div
                            className={cx(
                                styles["drawer-image__item"],
                                options.length - 1 !== index ? styles["drawer-image__item-border"] : ""
                            )}
                            key={index}
                            onClick={() => onSelectItem(action)}
                        >
                            <Icon height={16} width={16} name={icon} color={"var(--primary)"} />
                            <p className={styles["drawer-image__item-text"]}>{label}</p>
                        </div>
                    ))}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerImage
