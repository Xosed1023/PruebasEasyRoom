type Value = {
    action: string
    payload: string
    file?: File
}

export type DrawerImageProps = {
    open: boolean
    withRemove: boolean
    onChange: (value: Value) => void
    onClose: () => void
}
