import { EllipsisProps } from './types'

const Ellipsis = ({ colorClass, marginTopClass }: EllipsisProps) => (
    <div className={`dc__border-radius-50-per ${marginTopClass ?? ''} icon-dim-6 ${colorClass ?? 'bcr-5'}`} />
)

export default Ellipsis
