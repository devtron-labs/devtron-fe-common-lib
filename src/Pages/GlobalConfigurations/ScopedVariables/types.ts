export enum ScopedVariablesFileViewType {
    /**
     * Used to show yaml editor for editing/creating variables
     */
    YAML = 'yaml',
    /**
     * Shows the variable list view
     */
    SAVED = 'variable-list',
    /**
     * Shows the variables in environment list view
     */
    ENVIRONMENT_LIST = 'environments',
}

export interface SavedVariablesViewParamsType {
    currentView: ScopedVariablesFileViewType
}
