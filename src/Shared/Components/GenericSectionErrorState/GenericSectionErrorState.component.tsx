import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-error-exclamation.svg'
import { ReactComponent as InfoIcon } from '../../../Assets/Icon/ic-exclamation.svg'
import { GenericSectionErrorStateProps } from './types'

const GenericSectionErrorState = ({
    reload,
    withBorder = false,
    title = 'Failed to load',
    subTitle = 'We could not load the information on this page.',
    description = 'Please reload or try again later',
    buttonText = 'Reload',
    rootClassName,
    useInfoIcon = false,
}: GenericSectionErrorStateProps) => (
    <div className={`flex column dc__gap-8 p-16 ${withBorder ? 'dc__border br-4' : ''} ${rootClassName || ''}`}>
        {useInfoIcon ? (
            <InfoIcon className="icon-dim-24 fcn-6" />
        ) : (
            <ErrorIcon className="icon-dim-24 alert-icon-r5-imp" />
        )}
        <div className="flex column dc__gap-4 dc__align-center">
            <h3 className="fs-13 lh-20 fw-6 cn-9 m-0">{title}</h3>
            <div className="flex column fs-13 lh-20 fw-4 cn-7">
                {subTitle && <p className="m-0">{subTitle}</p>}
                {description && <p className="m-0">{description}</p>}
            </div>
        </div>

        {reload && (
            <button
                type="button"
                className="cta text h-20 fs-13 lh-20-imp"
                onClick={reload}
                data-testid="generic-section-reload-button"
            >
                {buttonText}
            </button>
        )}
    </div>
)

export default GenericSectionErrorState
