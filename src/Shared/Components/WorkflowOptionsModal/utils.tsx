import { PipelineType } from '@Common/Types'
import { ChangeCIPayloadType, TriggerType } from '@Shared/types'

export const getSwitchToWebhookPayload = (changeCIPayload: ChangeCIPayloadType) => ({
    appId: changeCIPayload.appId,
    pipelines: [
        {
            // name and triggerType are useless to backend for this case
            name: 'change-webhook-ci',
            triggertype: TriggerType.Manual,
            appWorkflowId: changeCIPayload.appWorkflowId,
            environmentId: -1,
            id: 0,
            parentPipelineType: PipelineType.WEBHOOK,
            switchFromCiPipelineId: changeCIPayload.switchFromCiPipelineId,
        },
    ],
})
