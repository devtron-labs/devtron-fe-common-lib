interface DeletePayloadConfig {
    appId: string
    appWorkflowId: number
    pipelineId: number
    pipelineName: string
}

export interface DeleteCINodeButtonProps {
    testId: string
    isCIPipeline?: boolean
    disabled: boolean
    title: string
    isJobView?: boolean
    deletePayloadConfig: DeletePayloadConfig
    onDelete?: () => void
    getWorkflows: () => void
}
