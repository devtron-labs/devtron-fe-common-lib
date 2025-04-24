export interface NewClusterFormFooterProps {
    apiCallInProgress: boolean
    handleModalClose: () => void
}

export interface NewClusterFormProps extends Pick<NewClusterFormFooterProps, 'handleModalClose'> {
    FooterComponent: React.FunctionComponent<NewClusterFormFooterProps> &
        Record<'CTA' | 'Start', React.FunctionComponent<{}>>
}
