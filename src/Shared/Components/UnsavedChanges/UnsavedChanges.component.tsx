import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'

const UnsavedChanges = () => (
    <div className="flexbox dc__align-item-center dc__gap-6">
        <ICWarningY5 className="icon-dim-20 dc__no-shrink" />
        <span className="cn-9 fs-13 fw-4 lh-20">Unsaved changes</span>
    </div>
)

export default UnsavedChanges
