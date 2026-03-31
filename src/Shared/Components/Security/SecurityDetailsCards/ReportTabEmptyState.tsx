import { Icon, IconName } from '@Shared/Components/Icon'

export const ReportTabEmptyState = ({
    title,
    subtitle,
    icon = 'ic-warning',
}: {
    title: string
    subtitle: string
    icon?: IconName
}) => (
    <div className="flex dc__border br-8 fs-13 mw-600 dc__mxw-1000">
        <div className="flexbox-col dc__gap-12 dc__align-items-center p-20 w-300">
            <Icon name={icon} size={24} color="R500" />
            <div className="flex column dc__gap-4">
                <div className="flex fw-6 cn-9 lh-20">{title}</div>
                <div className="flex cn-8">{subtitle}</div>
            </div>
        </div>
    </div>
)
