import { SegmentedBarChart } from '@Common/SegmentedBarChart'
import { ReactComponent as ICShieldWarning } from '@Icons/ic-shield-warning-outline.svg'
import { ReactComponent as ICShieldSecure } from '@Icons/ic-shield-check.svg'
import { ReactComponent as ICArrowRight } from '@Icons/ic-caret-down-small.svg'
import { SecurityCardProps } from './types'
import { SUB_CATEGORIES } from '../SecurityModal/types'
import { SEVERITIES } from '../SecurityModal/constants'
import './securityCard.scss'
import { getTotalSeverities } from '../utils'
import { SECURITY_CONFIG } from '../constants'

const SecurityCard = ({
    category,
    subCategory,
    severityCount = {},
    handleCardClick,
    rootClassName = '',
}: SecurityCardProps) => {
    const totalCount = getTotalSeverities(severityCount)

    const hasThreats: boolean = !!totalCount

    const entities = Object.entries(SEVERITIES)
        .map(([key, severity]) => ({
            ...severity,
            value: severityCount[key],
        }))
        .filter((entity) => !!entity.value)

    const getTitleSubtitle = (): { title: string; subtitle?: string } => {
        switch (subCategory) {
            case SUB_CATEGORIES.EXPOSED_SECRETS:
                return hasThreats
                    ? { title: `${totalCount} exposed secrets` }
                    : {
                          title: 'No exposed secrets',
                          subtitle: 'No exposed secrets like passwords, api keys, and tokens found',
                      }
            case SUB_CATEGORIES.LICENSE:
                return hasThreats
                    ? { title: `${totalCount} license risks` }
                    : { title: 'No license risks', subtitle: 'No license risks or compliance issues found' }
            case SUB_CATEGORIES.MISCONFIGURATIONS:
                return hasThreats
                    ? { title: `${totalCount} misconfigurations` }
                    : { title: 'No misconfiguration', subtitle: 'No misconfigurations found' }
            default:
                return hasThreats
                    ? { title: `${totalCount} vulnerabilities` }
                    : { title: 'No vulnerabilities', subtitle: 'No security vulnerability found' }
        }
    }

    const { title, subtitle } = getTitleSubtitle()

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCardClick()
        }
    }

    return (
        <div
            className={`${rootClassName} w-100 bcn-0 p-20 flexbox-col dc__gap-16 br-8 dc__border security-card security-card${hasThreats ? '--threat' : '--secure'}`}
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={onKeyDown}
        >
            <div className="flexbox dc__content-space">
                <div className="flexbox-col">
                    <span className="fs-12 fw-4 lh-1-5 cn-7">{SECURITY_CONFIG[category].label}</span>
                    <div className="fs-15 fw-6 lh-1-5 cn-9 flex">
                        <span className="security-card-title">{title}</span>
                        <ICArrowRight className="icon-dim-20 dc__flip-270 scb-5 arrow-right" />
                    </div>
                </div>
                {hasThreats ? (
                    <ICShieldWarning className="icon-dim-24 scr-5 dc__no-shrink" />
                ) : (
                    <ICShieldSecure className="icon-dim-24 scg-5 dc__no-shrink" />
                )}
            </div>
            <div className="flexbox-col dc__gap-12">
                {hasThreats || severityCount.success ? (
                    <SegmentedBarChart
                        entities={entities}
                        labelClassName="fs-13 fw-4 lh-20 cn-9"
                        countClassName="fs-13 fw-6 lh-20 cn-7"
                    />
                ) : (
                    <div className="bcn-1 br-4 h-8" />
                )}
                {subtitle && <span>{subtitle}</span>}
            </div>
        </div>
    )
}

export default SecurityCard
