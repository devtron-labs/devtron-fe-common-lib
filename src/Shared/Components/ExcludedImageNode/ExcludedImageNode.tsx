import Tippy from '@tippyjs/react'
import { EXCLUDED_IMAGE_TOOLTIP } from '../../constants'
import { ExcludedImageNodeProps } from './types'
import { ReactComponent as ICAbort } from '../../../Assets/Icon/ic-abort.svg'

const ExcludedImageNode = ({ image }: ExcludedImageNodeProps) => (
    <Tippy className="default-tt w-200" arrow={false} placement="top" content={EXCLUDED_IMAGE_TOOLTIP}>
        <div className="flexbox pt-2 pb-2 pl-8 pr-8 br-4 bcr-1 dc__align-items-center dc__gap-4">
            <ICAbort className="icon-dim-20 fcr-5" />

            <p className="m-0 fs-12 lh-16 fw-4 cr-5">{image}</p>
        </div>
    </Tippy>
)

export default ExcludedImageNode
