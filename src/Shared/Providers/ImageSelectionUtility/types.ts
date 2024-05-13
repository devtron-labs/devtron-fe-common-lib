export interface ImageSelectionUtilityContextType {
    // TODO: Not Intended but will remove it later if time remains
    gitCommitInfoGeneric: (...props) => JSX.Element
    // TODO: Not Intended but will remove it later if time remains
    getModuleInfo: (moduleName: string) => Promise<any>
}

export interface ImageSelectionUtilityProviderProps {
    children: React.ReactNode
    value: ImageSelectionUtilityContextType
}
