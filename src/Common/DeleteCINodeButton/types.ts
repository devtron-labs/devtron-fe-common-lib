import { AppConfigProps } from '@Pages/index'

interface DeletePayloadConfig {
    appId: string
    appWorkflowId: number
    pipelineId: number
    pipelineName: string
}

export interface DeleteCINodeButtonProps extends Required<Pick<AppConfigProps, 'isTemplateView'>> {
    testId: string
    title: string
    showIconOnly?: boolean
    disabled?: boolean
    isJobView?: boolean
    deletePayloadConfig: DeletePayloadConfig
    onDelete?: () => void
    getWorkflows: () => void
}
