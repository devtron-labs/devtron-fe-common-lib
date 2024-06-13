import Tippy from '@tippyjs/react'
import { ReactComponent as DockerIcon } from '../../../Assets/Icon/ic-docker.svg'
import { ImageChipCellProps } from './types'
import './imageChipCell.scss'

const ImageChipCell = ({ handleClick, imagePath, isExpanded, registryType }: ImageChipCellProps) => (
    <div className="cn-7 fs-14 lh-20 flexbox">
        <Tippy content={imagePath} className="default-tt" placement="auto" arrow={false}>
            <button
                type="button"
                className={`display-grid dc__align-items-center image-chip-cell__container ${isExpanded ? 'image-chip-cell__container--expanded' : ''} bcn-1 br-6 dc__transparent py-0 px-6 cursor max-w-100`}
                onClick={handleClick}
            >
                {registryType ? (
                    <div className={`h-14 w-14 dc__registry-icon ${registryType} br-8 dc__no-shrink`} />
                ) : (
                    <DockerIcon className="icon-dim-14 mw-14" />
                )}
                {isExpanded ? (
                    <div className="mono dc__ellipsis-left direction-left">{imagePath}</div>
                ) : (
                    <>
                        <div>…</div>
                        <div className="mono dc__ellipsis-left direction-left text-overflow-clip">
                            {imagePath.split(':').slice(-1)[0] ?? ''}
                        </div>
                    </>
                )}
            </button>
        </Tippy>
    </div>
)

export default ImageChipCell
