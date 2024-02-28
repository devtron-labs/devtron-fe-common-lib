export interface GenericSectionErrorStateProps {
    /**
     * Handler for reloading the section
     */
    reload: () => void
    /**
     * If true, border is added to the section
     *
     * @default false
     */
    withBorder?: boolean
}
