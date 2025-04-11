import { Dispatch, SetStateAction } from 'react'

export interface NewClusterFormFooterProps {
    apiCallInProgress: boolean
    handleModalClose: () => void
}

export interface NewClusterFormProps extends NewClusterFormFooterProps {
    setApiCallInProgress: Dispatch<SetStateAction<boolean>>
    FooterComponent: React.FunctionComponent<NewClusterFormFooterProps>
}
