import Tippy from '@tippyjs/react'
import { ConditionalWrap } from '../../../../Common'
import { ImagePathTippyContentProps } from './types'
import { MaterialInfoProps } from '../types'
import { ReactComponent as DeployIcon } from '../../../../Assets/Icon/ic-nav-rocket.svg'

const ImagePathTippyContent = ({ imagePath, registryName }: ImagePathTippyContentProps) => (
    <div>
        <div className="fw-6 m-0">{registryName}</div>
        <div className="m-0">{imagePath}</div>
    </div>
)

const MaterialInfo = ({
    imagePath,
    registryName,
    registryType,
    image,
    deployedTime,
    excludedImagePathNode,
    approvalChecksNode,
}: MaterialInfoProps) => {
    const renderImagePathTippy = (children) => {
        const content = <ImagePathTippyContent imagePath={imagePath} registryName={registryName} />

        return (
            <Tippy className="default-tt dc__mxw-500" arrow={false} placement="top-start" content={content}>
                {children}
            </Tippy>
        )
    }

    const renderDeployedTime = () => {
        if (!deployedTime) return null

        return (
            <div className="material-history__info flex left">
                <DeployIcon className="icon-dim-16 scn-6 mr-8" />
                <span className="fs-13 fw-4">{deployedTime}</span>
            </div>
        )
    }

    return (
        <>
            <div className="flex left column">
                {excludedImagePathNode ?? (
                    <ConditionalWrap condition={!!imagePath} wrap={renderImagePathTippy}>
                        <div className="commit-hash commit-hash--docker">
                            <div className={`dc__registry-icon ${registryType} mr-8`} />
                            {image}
                        </div>
                    </ConditionalWrap>
                )}
            </div>

            {approvalChecksNode ?? renderDeployedTime()}
        </>
    )
}

export default MaterialInfo
