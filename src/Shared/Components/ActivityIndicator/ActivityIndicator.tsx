import { ActivityIndicatorProps } from './types'

const ActivityIndicator = ({
    rootClassName = '',
    backgroundColorClass = 'bcr-5',
    iconSizeClass = 'icon-dim-6',
}: ActivityIndicatorProps) => (
    <div className={`dc__border-radius-50-per ${backgroundColorClass} ${iconSizeClass} ${rootClassName}`} />
)

export default ActivityIndicator
