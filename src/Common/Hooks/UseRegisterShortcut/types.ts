export interface UseRegisterShortcutContextType {
    registerShortcut: boolean
    setRegisterShortcut: (allowShortcut: boolean) => void
}

export interface UseRegisterShortcutProviderType {
    children: React.ReactElement
}
