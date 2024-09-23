import { NavLink } from 'react-router-dom'

import { ReactComponent as ICFileCode } from '@Icons/ic-file-code.svg'
import {
    DeploymentConfigDiffProps,
    DeploymentConfigDiffState,
    diffStateIconMap,
    diffStateTextColorMap,
    diffStateTextMap,
} from '@Shared/Components/DeploymentConfigDiff'

const renderState = (diffState: DeploymentConfigDiffState) => {
    const Icon = diffStateIconMap[diffState]

    return (
        <div className="flex dc__gap-6">
            {Icon && <Icon className="icon-dim-16" />}
            <span className={`fs-12 lh-20 ${diffStateTextColorMap[diffState]}`}>{diffStateTextMap[diffState]}</span>
        </div>
    )
}

export const renderDeploymentHistoryConfig = (
    config: DeploymentConfigDiffProps['configList'],
    heading: string,
    pathname: string,
) => (
    <div className="dc__border br-4">
        {heading && (
            <div className="px-16 py-8 dc__border-bottom-n1">
                <h4 className="m-0 cn-7 fs-12 lh-20 fw-6">{heading}</h4>
            </div>
        )}
        {config.map(({ id, title, diffState }, index) => {
            const resourceType = (title.split('/')[0] || title).trim().toLowerCase().replace(' ', '-')
            const resourceName = title.split('/')[1]?.trim()

            return (
                <NavLink
                    key={id}
                    className={`cursor dc__no-decor px-16 py-12 flex dc__content-space ${index !== config.length - 1 ? 'dc__border-bottom-n1' : ''}`}
                    to={`${pathname}/${resourceType}${resourceName ? `/${resourceName}` : ''}`}
                >
                    <p className="m-0 flex dc__gap-8">
                        <ICFileCode className="icon-dim-20 scn-6" />
                        <span className="cb-5 fs-13 lh-20">{resourceName || title}</span>
                    </p>
                    {renderState(diffState)}
                </NavLink>
            )
        })}
    </div>
)

export const renderPipelineDeploymentStatusIcon = (status: string) => (
    <span
        className={`flexbox dc__align-items-start dc__app-summary__icon icon-dim-22 ${status
            .toLocaleLowerCase()
            .replace(/\s+/g, '')}`}
    />
)
