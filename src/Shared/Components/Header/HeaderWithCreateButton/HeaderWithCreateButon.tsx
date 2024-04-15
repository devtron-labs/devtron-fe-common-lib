import { useHistory, useLocation, useParams } from 'react-router-dom'
import { SERVER_MODE, URLS } from '../../../../Common'
import PageHeader from '../PageHeader'
import { ReactComponent as ChartIcon } from '../../../../Assets/Icon/ic-charts.svg'
import { ReactComponent as AddIcon } from '../../../../Assets/Icon/ic-add.svg'
import { ReactComponent as JobIcon } from '../../../../Assets/Icon/ic-k8s-job.svg'
import { ReactComponent as ReleasesIcon } from '../../../../Assets/Icon/ic-open-box.svg'
import AppListConstants from './constants'
import './HeaderWithCreateButton.scss'
import { useMainContext } from '../../../Providers'
import { ButtonWithSelector } from '../../ButtonWithSelector'

interface HeaderWithCreateButtonProps {
    headerName: string
    buttonContent: string
    buttonType: string
    hideRelease: boolean
}

export enum PageHeaderButtonType {
    APP = 'app',
    JOB = 'job',
    RELEASE = 'release',
}

export const HeaderWithCreateButton = ({
    headerName,
    buttonContent,
    buttonType,
    hideRelease,
}: HeaderWithCreateButtonProps) => {
    const params = useParams<{ appType: string }>()
    const history = useHistory()
    const location = useLocation()
    const { serverMode } = useMainContext()

    const redirectToHelmAppDiscover = () => {
        history.push(URLS.CHARTS_DISCOVER)
    }

    const openCreateDevtronAppModel = () => {
        const canOpenModalWithDevtronApps = params.appType
            ? params.appType === AppListConstants.AppType.DEVTRON_APPS
            : serverMode === SERVER_MODE.FULL
        const _appType = canOpenModalWithDevtronApps ? AppListConstants.AppType.DEVTRON_APPS : URLS.APP_LIST_HELM
        const _urlPrefix = `${URLS.APP}/${URLS.APP_LIST}/${_appType}`
        history.push(`${_urlPrefix}/${AppListConstants.CREATE_DEVTRON_APP_URL}${location.search}`)
    }

    const openCreateJobModel = () => {
        history.push(`${URLS.JOB}/${URLS.APP_LIST}/${URLS.CREATE_JOB}`)
    }

    const openCreateReleaseModal = () => {
        history.push(`releases/create`)
    }

    const dropdownOptions = (
        <div className="flexbox-col w-296 pt-4 pb-4 bcn-0 br-4 create-modal-wrapper">
            <button
                type="button"
                className="flexbox pl-10 pr-10 pt-8 pb-8 dc__transparent dc__gap-12"
                onClick={openCreateDevtronAppModel}
            >
                <div className="flexbox-col justify-start">
                    <AddIcon className="icon-dim-20 fcn-9" />
                </div>
                <div className="flexbox-col">
                    <span className="flexbox lh-20 cn-9 fs-13 fw-6">Custom Application</span>
                    <span className="flexbox lh-18 cn-7 fs-12 fw-4 text-left">
                        Build and deploy your code on a Kubernetes cluster
                    </span>
                </div>
            </button>
            <button
                type="button"
                className="flexbox pl-10 pr-10 pt-8 pb-8 dc__transparent dc__gap-12"
                onClick={redirectToHelmAppDiscover}
            >
                <div className="flexbox-col justify-start">
                    <ChartIcon className="icon-dim-20 fcn-9" />
                </div>
                <div className="flexbox-col">
                    <span className="flexbox lh-20 cn-9 fs-13 fw-6">App from chart store</span>
                    <span className="flexbox lh-18 cn-7 fs-12 fw-4 text-left">
                        Deploy apps using third-party helm charts (eg. Prometheus, Redis etc.)
                    </span>
                </div>
            </button>
            <button
                type="button"
                className="flexbox pl-10 pr-10 pt-8 pb-8 dc__transparent dc__gap-12"
                onClick={openCreateJobModel}
            >
                <div className="flexbox-col justify-start">
                    <JobIcon className="icon-dim-20 scn-9" />
                </div>
                <div className="flexbox-col">
                    <span className="flexbox lh-20 cn-9 fs-13 fw-6">Job</span>
                    <span className="flexbox lh-18 cn-7 fs-12 fw-4 text-left">
                        Jobs allow manual and automated execution of developer actions.
                    </span>
                </div>
            </button>
            {!hideRelease && (
                <button
                    type="button"
                    className="flexbox pl-10 pr-10 pt-8 pb-8 dc__transparent dc__gap-12"
                    onClick={openCreateReleaseModal}
                >
                    <div className="flexbox-col justify-start">
                        <ReleasesIcon className="icon-dim-20" />
                    </div>
                    <div className="flexbox-col">
                        <span className="flexbox lh-20 cn-9 fs-13 fw-6">Release</span>
                        <span className="flexbox lh-18 cn-7 fs-12 fw-4 text-left">
                            Create release package for bulk deployments
                        </span>
                    </div>
                </button>
            )}
        </div>
    )

    const buttonClickHandlerFunc = (btnType: string) => {
        switch (btnType) {
            case PageHeaderButtonType.APP:
                return openCreateDevtronAppModel
            case PageHeaderButtonType.JOB:
                return openCreateJobModel
            case PageHeaderButtonType.RELEASE:
                return openCreateReleaseModal
            default:
                throw new Error('Unsupported')
        }
    }

    const renderActionButtons = () =>
        serverMode === SERVER_MODE.FULL ? (
            <ButtonWithSelector
                buttonContent={buttonContent}
                buttonClickHandler={buttonClickHandlerFunc(buttonType)}
                menuItems={dropdownOptions}
            />
        ) : (
            <button type="button" className="flex cta h-32 lh-n" onClick={redirectToHelmAppDiscover}>
                Deploy helm charts
            </button>
        )

    return (
        <div className="create-button-container dc__position-sticky dc__top-0 bcn-0 dc__zi-4">
            <PageHeader headerName={headerName} renderActionButtons={renderActionButtons} />
        </div>
    )
}

export default HeaderWithCreateButton
