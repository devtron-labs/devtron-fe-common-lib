export interface UseRegisterShortcutContextType {
    registerShortcut: boolean
    setRegisterShortcut: (allowShorcut: boolean) => void
}

export interface UseRegisterShortcutProviderType {
    children: React.ReactElement
}
