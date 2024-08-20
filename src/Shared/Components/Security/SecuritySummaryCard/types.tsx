import { SeverityCount } from '@Shared/types'
import { AppDetailsPayload, ExecutionDetailsPayload } from '../SecurityModal'

interface ExecutionDetailsPayloadType {
    executionDetailsPayload: ExecutionDetailsPayload
    appDetailsPayload?: never
}

interface AppDetailsPayloadType {
    executionDetailsPayload?: never
    appDetailsPayload: AppDetailsPayload
}

export type SecuritySummaryCardProps = {
    severityCount: SeverityCount
    scanToolId: number
    rootClassName?: string
} & (ExecutionDetailsPayloadType | AppDetailsPayloadType)
