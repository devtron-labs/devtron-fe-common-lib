import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-errorInfo.svg'
import { GenericSectionErrorStateProps } from './types'

const GenericSectionErrorState = ({ reload, withBorder = false }: GenericSectionErrorStateProps) => (
    <div className={`flex column dc__gap-8 p-16 ${withBorder ? 'dc__border' : ''}`}>
        <ErrorIcon className="icon-dim-24 alert-icon-r5-imp" />
        <div className="flex column dc__gap-4">
            <h3 className="fs-13 lh-20 fw-6 cn-9 m-0">Failed to load</h3>
            <div className="flex column fs-13 lh-20 fw-4 cn-7">
                <p className="m-0">We could load the information on this page.</p>
                <p className="m-0">Please reload or try again later</p>
            </div>
        </div>
        <button type="button" className="cta text h-20 fs-13 lh-20-imp" onClick={reload}>
            Reload
        </button>
    </div>
)

export default GenericSectionErrorState
