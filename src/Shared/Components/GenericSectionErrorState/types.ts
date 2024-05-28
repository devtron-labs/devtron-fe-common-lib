export interface GenericSectionErrorStateProps {
    /**
     * Handler for reloading the section
     */
    reload?: () => void
    /**
     * If true, border is added to the section
     *
     * @default false
     */
    withBorder?: boolean
    /**
     * @default 'Failed to load'
     */
    title?: string
    /**
     * @default 'We could not load the information on this page.'
     */
    subTitle?: string
    /**
     * @default 'Please reload or try again later'
     */
    description?: string
    /**
     * @default 'Reload'
     */
    buttonText?: string
    /**
     * to be applied on parent div
     */
    rootClassName?: string
    /**
     * If true, info icon would be used instead of error
     *
     * @default false
     */
    useInfoIcon?: boolean
}
