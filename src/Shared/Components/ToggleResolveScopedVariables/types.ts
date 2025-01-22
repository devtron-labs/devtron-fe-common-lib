export interface ToggleResolveScopedVariablesProps {
    resolveScopedVariables: boolean
    handleToggleScopedVariablesView: () => void
    isDisabled?: boolean
    /**
     * @default true
     */
    showTooltip?: boolean
    throttleOnChange?: boolean
}
