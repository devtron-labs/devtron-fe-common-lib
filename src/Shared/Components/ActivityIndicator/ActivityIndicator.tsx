import { ActivityIndicatorProps } from './types'

const ActivityIndicator = ({ rootClassName = '' }: ActivityIndicatorProps) => (
    <div className={`dc__border-radius-50-per bcr-5 icon-dim-6 ${rootClassName}`} />
)

export default ActivityIndicator
